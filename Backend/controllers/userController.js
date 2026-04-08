import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { v2 as cloudinary } from "cloudinary";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Register User : api/user/register
export const register = async (req,res) =>{
    try {
        const {name, email, password} = req.body;
       if(!name || !email || !password){
        return res.json({success:false,message:"Missing Details"})
       }

       const existingUser = await User.findOne({email});
       
       if(existingUser){
        return res.json({success:false,message:"User Already Exists"});
       }
       
       const hashedPassword = await bcrypt.hash(password,10);
       const user = await User.create({name,email,password:hashedPassword});
       const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
       
       const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || true, // Force secure on Render
        sameSite: 'none', // Required for cross-site cookies on Render
        maxAge: 7 * 24 * 60 * 60 * 1000
       };

       res.cookie('token', token, cookieOptions);

       return res.json({success:true, user:{email:user.email, name:user.name}})

    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message});
    }
}

//Login User : api/user/login
export const login = async (req,res) =>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.json({success:false,message:"Missing Details"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false,message:"User Not Found"});
        }

        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid Email or Password"});
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});

        const cookieOptions = {
            httpOnly: true,
            secure: true, // Render is always HTTPS
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res.cookie('token', token, cookieOptions);

        return res.json({success:true,user:{email:user.email,name:user.name}});

    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message});
    }
}

//Check User : api/user/is-auth
export const isAuth = async(req,res) =>{
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        return res.json({success:true,user});
    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message});
    }
    
}

//Logout User : api/user/logout
export const userLogout = async (req,res) =>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        return res.json({success:true,message:"Logged out successfully"});
    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message});
    }
}

//Google Auth
export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, sub: googleId } = ticket.getPayload();
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, googleId });
        } else if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({ success: true, user: { email: user.email, name: user.name } });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: "Google Authentication Failed" });
    }
}

//Update User Profile : api/user/update-profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, gender, dob, removeImage } = req.body;
        const imageFile = req.file;

        if (!name) {
            return res.json({ success: false, message: "Name is required" });
        }

        const updateData = {
            name,
            phone,
            address: typeof address === 'string' ? JSON.parse(address) : address,
            gender,
            dob
        };

        if (removeImage === 'true') {
            updateData.image = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200';
        } else if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        await User.findByIdAndUpdate(userId, updateData);

        return res.json({ success: true, message: "Profile Updated Successfully" });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}
