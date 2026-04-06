import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/razorpay", createRazorpayOrder);
paymentRouter.post("/verify", verifyRazorpayPayment);

export default paymentRouter;
