import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    guests: { type: Number, required: true },
    selectedCars: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, default: false },
    status: { type: String, default: 'Booking Placed' },
    cancelReason: { type: String, default: '' },
    cancelComment: { type: String, default: '' },
    cancelledBy: { type: String, default: '' }
}, { timestamps: true });

export const Booking = mongoose.models.booking || mongoose.model("booking", bookingSchema);

export default Booking;
