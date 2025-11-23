import mongoose, { Mongoose, Schema } from 'mongoose'
import { ActivityType } from '../utilities/enums/activityType';

export interface IActivities extends Document{
    userId: mongoose.Types.ObjectId;
    activityType: string;
    startTime: Date;
    endTime: Date;
    distanceMeters: number;
    caloriesBurned: Number;
    deviceId: mongoose.Types.ObjectId;
}

const activitiesSchema :Schema<IActivities> = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        activityType: {
            type: String,
            required: true,
            enum: Object.values(ActivityType)
        },
         startTime: {
            type: Date,
            required: true,
        },
         endTime: {
            type: Date,
            required: true,
        },
         caloriesBurned: {
            type: Number,
            required: true,
        },
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "Device"
        }

    },
    {timestamps: true}
)

export default mongoose.model<IActivities>("Activity", activitiesSchema)