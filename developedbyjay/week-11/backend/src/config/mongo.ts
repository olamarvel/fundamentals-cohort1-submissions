import mongoose from "mongoose";

export async function connectMongo() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/payverse";
  await mongoose.connect(uri);
  console.log("Mongo connected");
}
