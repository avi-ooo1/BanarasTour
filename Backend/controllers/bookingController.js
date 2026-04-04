// Add Booking : api/booking/add

import Booking from "../models/Booking.js";

export const addBooking = async(req,res)=>{
    try {
        const {address,userId} = req.body;
        await Booking.create({...Booking,userId});
        res.json({success:true,message:"Booking Placed Successfully"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}