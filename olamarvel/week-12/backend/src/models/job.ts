import mongoose from 'mongoose';

export interface JOB{
  type: string;
  to: string;
  content:string;
  status: string;
  retries: number;
}


const JobSchema = new mongoose.Schema({
    type: String, // 'email' or 'sms'
    to: String,
    content: String,
    status: { 
        type: String, 
        enum: ['PENDING', 'SENT', 'FAILED'], 
        default: 'PENDING' 
    },
    retries: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Job', JobSchema);