import jwt from "jsonwebtoken";

// Login Seller : api/seller/login

export const adminLogin = async(req,res) =>{
   try {
     const {email,password} = req.body;
   if(password === process.env.ADMIN_PASSWORD && email === process.env.ADMIN_EMAIL){
     const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn : '7d'});
      res.cookie('adminToken',token,{
            httpOnly:true,
            secure:process.env.Node_ENV === "production",
            sameSite:process.env.Node_ENV === 'production' ? 'none' : 'strict',
            maxAge:7 * 24 * 60 * 60 * 1000
        });
        res.json({success:true,message:"Admin Login Successfully"});
   }else{
        return res.json({success:false,message:"Invalid Credentials"});
   }
   } catch (error) {
    console.log(error);
    return res.json({success:false,message:error.message});
   }
}

//Check Admin : api/admin/is-auth
export const isAdminAuth = async(req,res) =>{
    try {
        return res.json({success:true,user});
    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message});
    }
    
}

//Logout Admin : api/admin/logout
export const adminLogout = async (req,res) =>{
    try {
        res.clearCookie('adminToken',{
            httpOnly:true,
            secure : process.env.Node_ENV === "production",
            sameSite:process.env.Node_ENV === 'production' ? 'none' : 'strict'
        })
        return res.json({success:true,message:"Logged out successfully"});
    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message});
    }
}