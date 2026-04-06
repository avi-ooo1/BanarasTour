import express from "express";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";
import { addBooking, getBookings, getAllBookings, updateBookingStatus, deleteBooking } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/add",authUser,addBooking);
bookingRouter.post("/get",authUser,getBookings);

// Admin Routes
bookingRouter.get("/all",authAdmin,getAllBookings);
bookingRouter.post("/status",authAdmin,updateBookingStatus);
bookingRouter.post("/remove",authAdmin,deleteBooking);

export default bookingRouter;