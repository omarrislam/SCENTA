import mongoose from "mongoose";
import { env } from "./env";

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  __mongoose?: CachedMongoose;
};

const cached = globalWithMongoose.__mongoose ?? { conn: null, promise: null };
globalWithMongoose.__mongoose = cached;

export const connectDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(env.MONGO_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
