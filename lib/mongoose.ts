import mongoose, { Mongoose } from "mongoose";
import { promise } from "zod";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

const cache = global.mongoose;

if (!cache) {
  global.mongoose = global.mongoose = { conn: null, promise: null };
}

export const dbConnect = async () => {
  if (cache.conn) {
    return cache.conn;
  }
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devOverFlow",
      })
      .then((result) => {
        console.log("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB:", error);
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
};
