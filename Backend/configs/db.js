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

    let uri = process.env.MONGODB_URI.trim();
    
    // Remove leading/trailing quotes if they exist
    if (uri.startsWith('"') && uri.endsWith('"')) {
      uri = uri.substring(1, uri.length - 1);
    } else if (uri.startsWith("'") && uri.endsWith("'")) {
      uri = uri.substring(1, uri.length - 1);
    }

    mongoose.connection.on('connected', () => console.log("Database Connected"));
    mongoose.connection.on('error', (err) => console.error("MongoDB error:", err.message));

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
  } catch (error) {
    console.error("MongoDB connection FAILED:", error.message);
    if (process.env.MONGODB_URI) {
       const rawUri = process.env.MONGODB_URI;
       const maskedUri = rawUri.replace(/\/\/.*@/, "//***:***@");
       console.log("Attempted URI (masked):", maskedUri);
       console.log("URI Length:", rawUri.length);
       console.log("URI First 10 chars:", rawUri.substring(0, 10));
    }
    isConnected = false;
    throw error; // Rethrow so middleware can catch it
  }
}

export default connectDB;