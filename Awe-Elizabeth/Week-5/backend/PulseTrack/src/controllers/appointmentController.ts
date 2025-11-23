import mongoose from "mongoose";
import { Request, Response } from "express";
import Appointments from "../models/Appointments";
import asyncHandler from "../utilities/asyncHandler";
import Provider from "../models/Provider";

export const GetUserAppointments = asyncHandler(async (req: Request, res:Response) => {
  if(!req.user){
        return res.status(403).json({success: false, message: "unauthorized user"})
    }
    const meals = await Appointments.find({userId: req.user.id})

    return res.status(200).json({
      success: true,
      message: "success",
      result: meals
    });
});

export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
    const {title, provider, time, durationMinutes, reason, status } = req.body;

    if(!req.user){
        return res.status(403).json({success: false, message: "unauthorized user"})
    }
    if(!title || !provider || !time || !durationMinutes || !reason ){
        return res.status(400).json({success: false, message: "appointment title, time, duration, reason, status and health provider is required"})
    }
    const isProvider = await Provider.findById(provider);
    if(!isProvider){
        return res.status(404).json({success: false, message: "provider does not exist"})
    }
    const appointment = Appointments.create({
        userId: req.user.id,
        title,
        provider,
        time,
        durationMinutes,
        reason,
        status
    });

    return res.status(201).json({
        success: true,
        message: "success",
        result: appointment
    })

});

export const updateAppointment = asyncHandler(async (req: Request, res: Response) => {

    const {title, provider, time, durationMinutes, reason, status } = req.body;
        
        if(!req.params?.appointmentId){
            return res.status(403).json({success: false, message: "activity id is required"})
        }
        const appointment = await Appointments.findById(req.params.appointmentId);
        if(!appointment){
            return res.status(404).json({success: false, message: "activity does not exist"})
        }
        if(!req.user || appointment.userId.toString() !== req.user?.id?.toString()){
            return res.status(403).json({success: false, message: "user is not authorized to access this activity"})
        }
        appointment.title = title ? title : appointment.title
        appointment.provider = provider ? provider : appointment.provider
        appointment.time = time? time : appointment.time
        appointment.durationMinutes = durationMinutes ? durationMinutes : appointment.durationMinutes
        appointment.reason = reason ? reason : appointment.reason
        appointment.status = status ? status : appointment.status
        
        await appointment.save()
        return res.status(200).json({
            success: true,
            message: "success",
            result: appointment
        });
});