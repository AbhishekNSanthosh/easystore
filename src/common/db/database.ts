import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("==> Mongo Already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!, {
      dbName: "attendease",
      writeConcern: { w: 'majority' },
    });
    isConnected = true;
    console.log("==> Mongo Successfully connected");
  } catch (error) {
    console.log('Connection error:', error);
  }
};
