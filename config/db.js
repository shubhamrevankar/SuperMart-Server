import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB server");
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB server");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
