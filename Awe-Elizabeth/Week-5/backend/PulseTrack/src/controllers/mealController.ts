import Meal, {IMeal} from "../models/Meals";
import mongoose from "mongoose";
import { Request, Response } from "express";
import Food from "../models/Food";
import asyncHandler from "../utilities/asyncHandler";
import { IMealItems } from '../utilities/interfaces/mealItems';
import { INutrients } from '../utilities/interfaces/nutrients';
import { isDateTime } from "../utilities/utilityFunction";
import { json } from "stream/consumers";

export const GetUserMeals = asyncHandler(async (req: Request, res:Response) => {
  if(!req.user){
        return res.status(403).json({success: false, message: "unauthorized user"})
    }
    const meals = await Meal.find({userId: req.user.id})

    return res.status(200).json({
      success: true,
      message: "success",
      result: meals
    })
})

export const createMeal = asyncHandler(async (req: Request, res: Response) => {
    const {eatenAt, mealType, mealItems } = req.body;

    if(!req.user){
        return res.status(403).json({success: false, message: "unauthorized user"})
    }
    if(!eatenAt || !mealType || !mealItems){
      return res.status(400).json({success: false, message: "all fields are required"})
    }
    if(!isDateTime(eatenAt)){
      return res.status(400).json({success: false, message: "Invalid datetime format. Use 'YYYY-MM-DDTHH:mm:ss' or 'YYYY-MM-DD HH:mm:ss"})
    }
    var nutrient : INutrients = {
      calories : 0,
      carbohydrate: 0,
      fat: 0,
      protein: 0,
      vitamins: 0,
      water: 0
    }

    for(const item of mealItems){
       const food =  await Food.findById(item.food)
      if(!food){
        return res.status(400).json({success: false, message: "food item does not exist "})
      }
      nutrient.calories += food.nutrients.calories;
      nutrient.carbohydrate += food.nutrients.carbohydrate;
      nutrient.fat += food.nutrients.fat;
      nutrient.protein += food.nutrients.protein;
      nutrient.vitamins += food.nutrients.vitamins;
      nutrient.water += food.nutrients.water
    }

    const meal = await Meal.create({
      userId:req.user.id,
      eatenAt,
      mealType,
      mealItems,
      totalNutrient: nutrient
    });

    res.status(200).json({
      success: true,
      message: "success",
      result: meal
    })
});

