// Add Booking : api/booking/add

import Booking from "../models/Booking.js";
import User from "../models/User.js";

const calculateAvailability = async (targetDateStr, excludeBookingId = null) => {
    const targetDateObj = new Date(targetDateStr);
    const prevDayStr = new Date(targetDateObj.getTime() - 86400000).toISOString().split('T')[0];
    const nextDayStr = new Date(targetDateObj.getTime() + 86400000).toISOString().split('T')[0];
    
    let query = { date: { $in: [prevDayStr, targetDateStr, nextDayStr] }, status: { $ne: 'Cancelled' } };
    if (excludeBookingId) query._id = { $ne: excludeBookingId };
    
    const existingBookings = await Booking.find(query);
    
    let carsUsedOnDay1 = 0; // targetDateStr
    let carsUsedOnDay2 = 0; // nextDayStr
    
    existingBookings.forEach(b => {
        let carsInBooking = 0;
        if (b.selectedCars && Array.isArray(b.selectedCars)) {
            b.selectedCars.forEach(c => carsInBooking += (Number(c.quantity) || 0));
        }
        if (b.date === prevDayStr) carsUsedOnDay1 += carsInBooking;
        else if (b.date === targetDateStr) {
            carsUsedOnDay1 += carsInBooking;
            carsUsedOnDay2 += carsInBooking;
        }
        else if (b.date === nextDayStr) carsUsedOnDay2 += carsInBooking;
    });
    
    return Math.max(0, 10 - Math.max(carsUsedOnDay1, carsUsedOnDay2));
};

export const addBooking = async(req,res)=>{
    try {
        const { userId, ...bookingData } = req.body;
        
        // Enforce max 10 cars limit total per date (backend validation spanning 2 days)
        if (bookingData.selectedCars && Array.isArray(bookingData.selectedCars)) {
            const requestedCars = bookingData.selectedCars.reduce((sum, car) => sum + (Number(car.quantity) || 0), 0);
            const available = await calculateAvailability(bookingData.date);

            if (requestedCars > available) {
                if (available === 0) {
                    return res.json({ success: false, message: "No tour/cars available for the required 2-day period." });
                } else {
                    return res.json({ success: false, message: `Only ${available} car(s) available for the selected dates.` });
                }
            }
        }

        const actualUserId = userId || req.userId;
        let finalBookingData = { ...bookingData, userId: actualUserId };
        if (finalBookingData.payment) {
            finalBookingData.amountPaid = finalBookingData.totalAmount;
        }
        await Booking.create(finalBookingData);
        res.json({success:true,message:"Booking Placed Successfully"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

// Get Booking : api/booking/get
export const getBookings  = async(req,res)=>{
    try {
        const userId = req.userId || req.body.userId;
        const user = await User.findById(userId);
        
        let bookings = [];
        if (user && user.email) {
            // Find by userId or the email typed in the booking form
            bookings = await Booking.find({
                $or: [
                    { userId: userId },
                    { email: user.email }
                ]
            });
        } else {
            bookings = await Booking.find({userId});
        }

        // Auto-complete past bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let updated = false;
        for (let b of bookings) {
            const bookingDate = new Date(b.date);
            bookingDate.setHours(0, 0, 0, 0);
            if (bookingDate < today && !['Completed', 'Cancelled'].includes(b.status)) {
                b.status = 'Completed';
                await Booking.findByIdAndUpdate(b._id, { status: 'Completed' });
                updated = true;
            }
        }

        res.json({success:true,bookings});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

// Admin: Get All Bookings : api/booking/all
export const getAllBookings = async(req,res) => {
    try {
        const bookings = await Booking.find({});
        
        // Auto-complete past bookings for admin view too
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let b of bookings) {
            const bookingDate = new Date(b.date);
            bookingDate.setHours(0, 0, 0, 0);
            if (bookingDate < today && !['Completed', 'Cancelled'].includes(b.status)) {
                b.status = 'Completed';
                await Booking.findByIdAndUpdate(b._id, { status: 'Completed' });
            }
        }

        res.json({success:true, bookings});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// Admin: Update Booking Status : api/booking/status
export const updateBookingStatus = async(req,res) => {
    try {
        const {id, status, reason, comment} = req.body;
        let updateData = { status };
        if (status === 'Cancelled') {
            updateData.cancelReason = reason || 'Cancelled by Admin';
            if (comment) updateData.cancelComment = comment;
            updateData.cancelledBy = 'Tour Guide';
        }
        await Booking.findByIdAndUpdate(id, updateData);
        res.json({success:true, message:"Booking Status Updated"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// Admin: Delete Booking : api/booking/remove
export const deleteBooking = async(req,res) => {
    try {
        const {id} = req.body;
        await Booking.findByIdAndDelete(id);
        res.json({success:true, message:"Booking Deleted Successfully"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// Check Availability : api/booking/availability
export const checkAvailability = async (req, res) => {
    try {
        const { date } = req.body;
        if (!date) {
            return res.json({ success: false, message: "Date is required" });
        }
        
        const availableCars = await calculateAvailability(date);
        res.json({ success: true, availableCars });
    } catch (error) {
        console.log("Availability Error:", error);
        res.json({ success: false, message: error.message });
    }
}

// User: Cancel Booking : api/booking/cancel
export const cancelBooking = async (req, res) => {
    try {
        const { id, reason, comment } = req.body;
        const booking = await Booking.findById(id);
        if (!booking) return res.json({ success: false, message: "Booking not found" });

        // User ownership check
        if (booking.userId !== req.userId) {
            const user = await User.findById(req.userId);
            if (!user || booking.email !== user.email) {
                return res.json({ success: false, message: "Not authorized to cancel this booking" });
            }
        }

        // Only allow cancel if not already completed/cancelled
        if (booking.status === 'Completed' || booking.status === 'Cancelled') {
            return res.json({ success: false, message: `Booking is already ${booking.status}` });
        }

        await Booking.findByIdAndUpdate(id, { 
            status: 'Cancelled',
            cancelReason: reason || 'Not provided',
            cancelComment: comment || '',
            cancelledBy: 'User'
        });
        res.json({ success: true, message: "Booking Cancelled Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// User: Update Booking : api/booking/update-booking
export const updateBookingData = async (req, res) => {
    try {
        const { id, newDate, newGuests, newSelectedCars, newTotalAmount } = req.body;
        if (!newDate || !newGuests || !newSelectedCars || !newTotalAmount) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const booking = await Booking.findById(id);
        if (!booking) return res.json({ success: false, message: "Booking not found" });

        // User ownership check
        if (booking.userId !== req.userId) {
            const user = await User.findById(req.userId);
            if (!user || booking.email !== user.email) {
                return res.json({ success: false, message: "Not authorized to change this booking" });
            }
        }

        if (booking.status === 'Completed' || booking.status === 'Cancelled') {
            return res.json({ success: false, message: `Cannot edit a ${booking.status} booking` });
        }

        // Availability check on the new date
        const requestedCars = newSelectedCars.reduce((sum, car) => sum + (Number(car.quantity) || 0), 0);
        const available = await calculateAvailability(newDate, id); // Exclude current booking
        
        if (requestedCars > available) {
            return res.json({ success: false, message: available === 0 ? "No tour/cars available for the required 2-day period." : `Only ${available} car(s) left for new dates.` });
        }

        // Financial logic
        let updateData = { 
            date: newDate, 
            guests: newGuests, 
            selectedCars: newSelectedCars, 
            totalAmount: newTotalAmount 
        };

        if (booking.paymentMethod === 'Online' && booking.payment) {
            const currentlyPaid = booking.amountPaid || booking.totalAmount;
            if (newTotalAmount > currentlyPaid) {
                // If the user hasn't explicitly passed 'paymentConfirmed' flag
                if (!req.body.paymentConfirmed) {
                    return res.json({ 
                        success: false, 
                        requirePayment: true, 
                        amountToPay: newTotalAmount - currentlyPaid, 
                        message: "Additional payment required to add more cars." 
                    });
                }
                // If paymentConfirmed is true, it means Razorpay verification succeeded on the frontend
                updateData.amountPaid = newTotalAmount; // we received the difference
            } else if (newTotalAmount < currentlyPaid) {
                updateData.amountPaid = newTotalAmount;
                updateData.refundAmount = (booking.refundAmount || 0) + (currentlyPaid - newTotalAmount);
            }
        }

        await Booking.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Booking Updated Successfully", refundAmount: updateData.refundAmount });
    } catch (error) {
         res.json({ success: false, message: error.message });
    }
};