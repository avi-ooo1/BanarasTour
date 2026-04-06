// Add Booking : api/booking/add

import Booking from "../models/Booking.js";

export const addBooking = async(req,res)=>{
    try {
        const { userId, ...bookingData } = req.body;
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
        const bookings = await Booking.find({userId});
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