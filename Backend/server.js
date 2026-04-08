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

// Trust the first proxy (Render uses a proxy)
app.set('trust proxy', 1);


connectDB();
connectCloudinary();

//allow multiple origin
const allowOrigin = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://banaras-tour.vercel.app",
  /\.vercel\.app$/
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const isAllowed = allowOrigin.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

//Middleware configuration
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors(corsOptions));
app.options(/^(.*)$/, cors(corsOptions));




// Middleware to ensure DB is connected before processing requests
const ensureDB = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Connection Middleware Error:", err.message);
    res.status(500).send("Database Connection Error");
  }
};

app.get('/',(req,res)=>{
    res.send("API is Working");
})

// Apply ensureDB middleware to all api routes
app.use("/api", ensureDB);

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

export default app;