import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI as string;
import "../models";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

// Connection states enum for clarity
const ConnectionStates = {
  disconnected: 0,
  connected: 1,
  connecting: 2,
  disconnecting: 3,
} as const;

// Track if we're currently connecting to prevent duplicate connection attempts
let isConnecting = false;

// Set up connection event listeners only once
let listenersInitialized = false;

const initializeListeners = () => {
  if (listenersInitialized) return;
  
  mongoose.connection.on("connected", () => {
    console.log("✅ Connected to MongoDB");
    isConnecting = false;
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
    isConnecting = false;
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
    isConnecting = false;
  });

  listenersInitialized = true;
};

export const dbConnect = async () => {
  initializeListeners();

  const currentState = mongoose.connection.readyState;

  // Already connected - return immediately (this is your "cache")
  if (currentState === ConnectionStates.connected) {
    return mongoose;
  }

  // Already connecting - wait for it
  if (isConnecting || currentState === ConnectionStates.connecting) {
    while (mongoose.connection.readyState === ConnectionStates.connecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (mongoose.connection.readyState === ConnectionStates.connected) {
      return mongoose;
    }
  }

  // If in a bad state (disconnecting), wait for it to finish
  if (currentState === ConnectionStates.disconnecting) {
    await mongoose.connection.close();
  }

  isConnecting = true;

  try {
    const opts = {
      dbName: "devOverFlow",
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
    };

    await mongoose.connect(MONGODB_URI, opts);
    isConnecting = false;
    return mongoose;
  } catch (error) {
    isConnecting = false;
    throw error;
  }
};