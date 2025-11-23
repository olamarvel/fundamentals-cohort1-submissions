// utils/reportGenerator.ts
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import  Activity  from "../models/Activities";
import  Meal  from "../models/Meals";
import Report from "../models/Reports";
import { ReportType } from "./enums/reportType";
import User from "../models/User";

export const generateReport = async (reportType: ReportType) => {
  const users = await User.find();

  for (const user of users) {
    let startDate: Date, endDate: Date;

    if (reportType === ReportType.DAILY) {
      startDate = startOfDay(new Date());
      endDate = endOfDay(new Date());
    } else if (reportType === ReportType.WEEKLY) {
      startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
      endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    } else {
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
    }

    const activityAgg = await Activity.aggregate([
      { $match: { userId: user._id, startTime: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: null,
          totalSteps: { $sum: "$steps" },
          totalCaloriesBurned: { $sum: "$caloriesBurned" },
          totalDistanceKm: { $sum: "$distanceKm" },
          totalActiveMinutes: { $sum: "$durationMinutes" },
          avgHeartRate: { $avg: "$avgHeartRate" },
        },
      },
    ]);

    const mealAgg = await Meal.aggregate([
      { $match: { userId: user._id, eatenAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, totalCaloriesConsumed: { $sum: "$totalCalories" } } },
    ]);

    const activityData = activityAgg[0] || {};
    const mealData = mealAgg[0] || {};

    await Report.create({
      userId: user._id,
      reportType,
      startDate,
      endDate,
      totalCaloriesBurned: activityData.totalCaloriesBurned || 0,
      totalDistanceKm: activityData.totalDistanceKm || 0,
      totalActiveMinutes: activityData.totalActiveMinutes || 0,
      totalCaloriesConsumed: mealData.totalCaloriesConsumed || 0,
    });

    console.log(` ${reportType} report generated for ${user.firstName}`);
  }
};
