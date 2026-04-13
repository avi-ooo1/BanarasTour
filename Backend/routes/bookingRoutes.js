import express from "express";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";
import { addBooking, getBookings, getAllBookings, updateBookingStatus, deleteBooking, checkAvailability, cancelBooking, changeBookingDate } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/add",authUser,addBooking);
bookingRouter.post("/get",authUser,getBookings);
bookingRouter.post("/availability", checkAvailability);
bookingRouter.post("/cancel", authUser, cancelBooking);
bookingRouter.post("/change-date", authUser, changeBookingDate);

// Admin Routes
bookingRouter.get("/all",authAdmin,getAllBookings);
bookingRouter.post("/status",authAdmin,updateBookingStatus);
bookingRouter.post("/remove",authAdmin,deleteBooking);

export default bookingRouter;