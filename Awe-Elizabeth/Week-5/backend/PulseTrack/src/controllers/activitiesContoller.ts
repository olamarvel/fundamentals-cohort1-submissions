import mongoose from "mongoose";
import { Request, Response } from "express";
import asyncHandler from "../utilities/asyncHandler";
import Activities, { IActivities } from "../models/Activities";
import { isDateTime, isEnumValue } from "../utilities/utilityFunction";
import { ActivityType } from "../utilities/enums/activityType";


export const getAllUserActivities = asyncHandler(async (req: Request, res: Response) => {
    if(!req.user){
        return res.status(403).json({success: false, message: "unauthorized user"})
    }
    const activities = await Activities.find({userId: req.user.id})
    return res.status(200).json({
        success: true,
        message: "success",
        result: activities
    })
});

export const addActivity = asyncHandler(async (req: Request, res: Response) => {
    const {activityType, startTime, endTime, caloriesBurned, distanceMeters} = req.body;
    if(!req.user){
        return res.status(403).json({success: false, message: "unauthorized user"})
    }

    if(!activityType || !startTime || !endTime || !caloriesBurned ){
        return res.status(400).json({success: false, message: "the activity type, startTime, endTime and caloriesBurned us required"})
    }
    if(!isEnumValue(activityType, ActivityType)){
        return res.status(400).json({success: false, message: "invalid activity type"})
    }

    if(!isDateTime(startTime) || !isDateTime(endTime)){
        return res.status(400).json({success: false, message: "Invalid datetime format. Use 'YYYY-MM-DDTHH:mm:ss' or 'YYYY-MM-DD HH:mm:ss"})
    }

    const activity = await Activities.create({
        userId: req.user.id,
        startTime,
        endTime,
        caloriesBurned,
        distanceMeters
    })
    return res.status(200).json({
        success: true,
        message: "success",
        result: activity
    })
});

export const updateActivity = asyncHandler(async (req: Request, res: Response) => {
    const {activityType, startTime, endTime, caloriesBurned, distanceMeters} = req.body;
    
    if(!req.params.activityId){
        return res.status(403).json({success: false, message: "activity id is required"})
    }
    const activity = await Activities.findById(req.params.activityId);
    if(!activity){
        return res.status(404).json({success: false, message: "activity does not exist"})
    }
    if(activity.userId.toString() !== req.user?.id?.toString()){
        return res.status(403).json({success: false, message: "user is not authorized to access this activity"})
    }
     if(activityType &&!isEnumValue(activityType, ActivityType)){
        return res.status(400).json({success: false, message: "invalid activity type"})
    }

    if((startTime && !isDateTime(startTime))|| (endTime && !isDateTime(endTime))){
        return res.status(400).json({success: false, message: "Invalid datetime format. Use 'YYYY-MM-DDTHH:mm:ss' or 'YYYY-MM-DD HH:mm:ss"})
    }
    activity.activityType = activityType ? activityType : activity.activityType
    activity.startTime = startTime ? startTime : activity.startTime
    activity.endTime = endTime? endTime : activity.endTime
    activity.caloriesBurned = caloriesBurned ? caloriesBurned : activity.caloriesBurned
    activity.distanceMeters = distanceMeters ? distanceMeters : activity.distanceMeters
    
    await activity.save()
    return res.status(200).json({
        success: true,
        message: "success",
        result: activity
    })
})