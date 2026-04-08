import mongoose from "mongoose";

// Cache the connection for serverless (Vercel) environments
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    mongoose.connection.on('connected', () => console.log("Database Connected"));
    mongoose.connection.on('error', (err) => console.error("MongoDB error:", err.message));

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
  } catch (error) {
    console.error("MongoDB connection FAILED:", error.message);
    if (process.env.MONGODB_URI) {
       const maskedUri = process.env.MONGODB_URI.replace(/\/\/.*@/, "//***:***@");
       console.log("Attempted URI (masked):", maskedUri);
    }
    isConnected = false;
  }
}

export default connectDB;