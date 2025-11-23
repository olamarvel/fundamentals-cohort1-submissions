import mongoose, { Mongoose, Schema } from 'mongoose'
import { projectSkillLevel, projectSkills } from '../utilities/enums/skills';
import { appointment } from '../utilities/enums/appointmentStatus';

export interface IAppointments extends Document{
    userId: mongoose.Types.ObjectId;
    title: string;
    provider: mongoose.Types.ObjectId;
    time: Date;
    durationMinutes: number;
    reason: string;
    status: string
}


const AppointmentSchema : Schema<IAppointments> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    provider:{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    time:{
        type: Date,
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(appointment),
        required: true,
        default: appointment.Scheduled
    }
},
{ timestamps: true }
);


export default mongoose.model<IAppointments>("Appointment", AppointmentSchema);
