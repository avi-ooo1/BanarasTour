import mongoose from "mongoose";

// Cache the connection for serverless (Vercel) environments
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    mongoose.connection.on('error', (err) => console.error("MongoDB error:", err.message));

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
  } catch (error) {
    console.error("MongoDB connection FAILED:", error.message);
    isConnected = false;
  }
}

export default connectDB;