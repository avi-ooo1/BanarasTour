import express from "express";
import authUser from "../middlewares/authUser.js";
import { updateMyBooking } from "../controllers/myBookingController.js";

const myBookingRouter = express.Router();

myBookingRouter.post("/update",authUser,updateMyBooking);

export default myBookingRouter;