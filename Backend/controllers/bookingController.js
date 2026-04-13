// Add Booking : api/booking/add

import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const addBooking = async(req,res)=>{
    try {
        const { userId, ...bookingData } = req.body;
        
        // Enforce max 10 cars limit total per date (backend validation)
        if (bookingData.selectedCars && Array.isArray(bookingData.selectedCars)) {
            const requestedCars = bookingData.selectedCars.reduce((sum, car) => sum + (Number(car.quantity) || 0), 0);
            
            const existingBookings = await Booking.find({ date: bookingData.date });
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
        res.json({success:true, bookings});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// Admin: Update Booking Status : api/booking/status
export const updateBookingStatus = async(req,res) => {
    try {
        const {id, status} = req.body;
        await Booking.findByIdAndUpdate(id, {status});
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
        
        const existingBookings = await Booking.find({ date });
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