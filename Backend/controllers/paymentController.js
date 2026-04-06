import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";


// Initialize Razorpay Instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// POST : api/payment/razorpay
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
        return res.json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    
    if (!order) {
        return res.json({ success: false, message: "Failed to create order" });
    }

    res.json({
        success: true,
        order,
        key_id: process.env.RAZORPAY_API_KEY
    });
  } catch (error) {
    console.log("Razorpay Order Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// POST : api/payment/verify
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
        // Here you can update the booking as paid if you pass bookingId
        if (bookingId) {
            await Booking.findByIdAndUpdate(bookingId, { payment: true, paymentMethod: "Razorpay" });
        }
        res.json({ success: true, message: "Payment verified successfully" });
    } else {
        res.json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.log("Razorpay Verify Error:", error);
    res.json({ success: false, message: error.message });
  }
};
