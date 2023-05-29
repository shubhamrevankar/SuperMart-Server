import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (url) => {
  try {
    // console.log("Connecting to MongoDB server");
    // console.log("url", url);
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB server");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
