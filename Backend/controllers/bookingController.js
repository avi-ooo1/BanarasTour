// Add Booking : api/booking/add

import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const addBooking = async(req,res)=>{
    try {
        const { userId, ...bookingData } = req.body;
        
        // Enforce max 10 cars limit total per date (backend validation)
        if (bookingData.selectedCars && Array.isArray(bookingData.selectedCars)) {
            const requestedCars = bookingData.selectedCars.reduce((sum, car) => sum + (Number(car.quantity) || 0), 0);
            
            const existingBookings = await Booking.find({ date: bookingData.date, status: { $ne: 'Cancelled' } });
            let alreadyBooked = 0;
            existingBookings.forEach(b => {
                if (b.selectedCars && Array.isArray(b.selectedCars)) {
                    b.selectedCars.forEach(c => {
                        alreadyBooked += (Number(c.quantity) || 0);
                    });
                }
            });

            if (alreadyBooked + requestedCars > 10) {
                const available = Math.max(0, 10 - alreadyBooked);
                if (available === 0) {
                    return res.json({ success: false, message: "No tour/cars available on this date." });
                } else {
                    return res.json({ success: false, message: `Only ${available} car(s) available on this date.` });
                }
            }
        }

        const actualUserId = userId || req.userId;
        await Booking.create({ ...bookingData, userId: actualUserId });
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
        
        const existingBookings = await Booking.find({ date, status: { $ne: 'Cancelled' } });
        let alreadyBooked = 0;
        
        existingBookings.forEach(b => {
            if (b.selectedCars && Array.isArray(b.selectedCars)) {
                b.selectedCars.forEach(c => {
                    alreadyBooked += (Number(c.quantity) || 0);
                });
            }
        });
        
        const availableCars = Math.max(0, 10 - alreadyBooked);
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
        const existingBookings = await Booking.find({ date: newDate, status: { $ne: 'Cancelled' }, _id: { $ne: id } }); // Exclude current booking
        let alreadyBooked = 0;
        existingBookings.forEach(b => {
             if (b.selectedCars && Array.isArray(b.selectedCars)) {
                 b.selectedCars.forEach(c => alreadyBooked += (Number(c.quantity) || 0));
             }
        });
        
        if (alreadyBooked + requestedCars > 10) {
            const available = Math.max(0, 10 - alreadyBooked);
            return res.json({ success: false, message: available === 0 ? "No tour/cars available on new date." : `Only ${available} car(s) left on new date.` });
        }

        await Booking.findByIdAndUpdate(id, { 
            date: newDate, 
            guests: newGuests, 
            selectedCars: newSelectedCars, 
            totalAmount: newTotalAmount 
        });
        
        res.json({ success: true, message: "Booking Updated Successfully" });
    } catch (error) {
         res.json({ success: false, message: error.message });
    }
};