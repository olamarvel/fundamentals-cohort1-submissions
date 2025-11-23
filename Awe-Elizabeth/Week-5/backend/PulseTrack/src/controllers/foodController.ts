import Meal, {IMeal} from "../models/Meals";
import mongoose from "mongoose";
import { Request, Response } from "express";
import Food from "../models/Food";
import asyncHandler from "../utilities/asyncHandler";

export const getFood = asyncHandler(async (req: Request, res:Response) => {
  if(!req.user){
        return res.status(403).json({success: false, message: "unauthorized user"})
    }
    const food = await Food.find()

    return res.status(200).json({
      success: true,
      message: "success",
      result: food
    })
})
