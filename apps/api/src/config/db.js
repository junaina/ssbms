import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MONGO DB CONNECTED!!");
  } catch (err) {
    console.error("mongo db connectio failed:/", err.message);
    process.exit(1);
  }
}
