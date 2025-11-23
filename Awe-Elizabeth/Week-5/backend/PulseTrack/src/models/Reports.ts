import mongoose, { Mongoose, Schema } from 'mongoose'
import { ReportType } from '../utilities/enums/reportType';

export interface IReport extends Document{
    userId: mongoose.Types.ObjectId;
    reportType: ReportType;
    totalconsumedCalories: number;
    totalExpendedCalories: number;
    totalActivityMinutes: number
    totalDurationMinutes: number;
}

const ReportSchema : Schema<IReport>=new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportType:{
        type: String,
        enum: ReportType,
        required: true
    },
    totalconsumedCalories: {
        type: Number,
        required: true
    },
    totalExpendedCalories: {
        type: Number,
        required: true
    },
     totalActivityMinutes: {
        type: Number,
        required: true
    },
      totalDurationMinutes: {
        type: Number,
        required: true
    },
},
{ timestamps: true }
);


export default mongoose.model<IReport>("Report", ReportSchema);