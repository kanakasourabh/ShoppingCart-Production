import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDb = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.atlasUser}:${process.env.atlasPassword}@cluster1.tng8yhx.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Connected to database successfully");
  } catch (error) {
    console.log("Error in Mongo connection", error);
  }
};

export default connectDb;
