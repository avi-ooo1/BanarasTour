import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import adminRouter from "./routes/adminRoutes.js";
import productRouter from "./routes/productRoutes.js";
import myBookingRouter from "./routes/myBookingRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import contactRouter from "./routes/contactRoutes.js";


const app = express();
const port = process.env.PORT || 4000;


connectDB();
connectCloudinary();

//allow multiple origin
const allowOrigin = ["http://localhost:5173"];

//Middleware configuration
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({origin: allowOrigin,credentials: true}));




app.get('/',(req,res)=>{
    res.send("API is Working");
})

//User Routes
app.use("/api/user",userRouter);

//Admin Routes
app.use("/api/admin",adminRouter);

//Product Routes
app.use("/api/product",productRouter);

//My Booking Routes
app.use("/api/my-booking",myBookingRouter);

//Booking Routes
app.use("/api/booking",bookingRouter);

//Payment Routes
app.use("/api/payment", paymentRouter);

//Contact Routes
app.use("/api/contact", contactRouter);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})