import fs from "fs";
import path from "path";
import Food from "../models/Food";
import { connectDB, disconnectDB } from "../config/db";
import dotenv from "dotenv";
dotenv.config()


export const seedFoods = async ():Promise<void> => {
  try {
    const dataPath = path.join(__dirname, "data", "food.json");
    const foodsData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    await Food.insertMany(foodsData);
    console.log(`Inserted ${foodsData.length} food items successfully!`);
  } catch (error) {
    console.error("Error seeding foods:" + error);
  }finally {
   
  }
};

