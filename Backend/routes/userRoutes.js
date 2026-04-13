import express from "express";
import { register,login, isAuth, userLogout, googleAuth, updateUserProfile } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import { upload } from "../configs/multer.js";

const userRouter = express.Router();

userRouter.post("/register",register);
userRouter.post("/login",login); 
userRouter.get("/is-auth",authUser,isAuth);
userRouter.post("/logout",authUser,userLogout);
userRouter.post("/google-auth", googleAuth);
userRouter.post("/update-profile", authUser, upload.single('image'), updateUserProfile);

export default userRouter; 