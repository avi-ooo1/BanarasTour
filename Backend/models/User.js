import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:false},
    googleId:{type:String, required:false},
    image: { type: String, default: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200' },
    phone: { type: String, default: "" },
    address: { type: Object, default: { line1: "", line2: "" } },
    gender: { type: String, default: "Male" },
    dob: { type: String, default: "" },
    myBookingData:{type:Object, default:{}}
   
},{minimize:false})

export const User = mongoose.models.user || mongoose.model("user",userSchema);

export default User;