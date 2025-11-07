import "dotenv/config";
import mongoose from "mongoose";

async function db() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ✨");
  } catch {
    console.log("Error connecting to MongoDB");
  }
}

export default db;
