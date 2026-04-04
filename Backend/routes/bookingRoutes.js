import express from "express";
import authUser from "../middlewares/authUser.js";
import { addBooking } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/add",authUser,addBooking);


export default bookingRouter;