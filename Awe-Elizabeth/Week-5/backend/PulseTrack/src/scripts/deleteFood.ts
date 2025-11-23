import { connectDB, disconnectDB } from "../config/db.js";
import Food from "../models/Food.js";
import dotenv from "dotenv";
dotenv.config();


const deleteFoods = async () => {
  try {
     await connectDB(process.env.MONGOURL || "");
    const result = await Food.deleteMany();
    console.log(` Deleted ${result.deletedCount} food items from DB`);
  } catch (error) {
    console.error(" Error deleting foods:");
  }finally {
    await disconnectDB();
  } 
};

deleteFoods();
