import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connection successful");
  } catch (err) {
    console.log("DB connection Error: ", err);
    process.exit(1);
  }
}

export default connectDB;
