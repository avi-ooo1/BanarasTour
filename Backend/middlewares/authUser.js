import jwt from "jsonwebtoken";

const authUser = (req,res,next) =>{
    // Extract token ONLY from Authorization header (Bearer token) to avoid ghost cookie issues
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if(!token){
        return res.json({success:false, message:"Not Authorized"})
    }
    try{
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.userId = tokenDecode.id;
        }else{
            return res.json({success:false, message:"Not Authorized"})
        }
        next();
    }
    catch(error){
        return res.json({success:false, message:"Not Authorized"})
    }
    
}

export default authUser;