

import User from "../models/User.js";

//Update User MyBooking Data : /api/my-booking/update

export const updateMyBooking = async(req,res)=>{
    try {
        const {userId, itemId, bookingDetails} = req.body;

        const userData = await User.findById(userId);
        if(!userData) {
            return res.json({success:false, message:"User not found"});
        }

        let myBookingData = userData.myBookingData || {};
        
        // Update the booking profile for the specific item with new details
        myBookingData[itemId] = bookingDetails;

        await User.findByIdAndUpdate(userId, {myBookingData});

        res.json({success:true, message:"Booking Updated Successfully"});

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}