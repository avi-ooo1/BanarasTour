import jwt from "jsonwebtoken";

const authAdmin = async(req,res,next) =>{
    const adminToken = req.cookies.adminToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if(!adminToken){
        return res.json({success:false,message:"Not Authorized"});
    }
    try{
            const tokenDecode = jwt.verify(adminToken,process.env.JWT_SECRET);
            if(tokenDecode.email === process.env.ADMIN_EMAIL){
                next();
            }else{
                return res.json({success:false, message:"Not Authorized"})
            }
           
        }
        catch(error){
            return res.json({success:false, message:"Not Authorized"})
        }
}

export default authAdmin;