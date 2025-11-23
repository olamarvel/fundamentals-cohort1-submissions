import mongoose, { Mongoose, Schema } from 'mongoose'

export interface ITasks extends Document{
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    dueTime: Date;
    schedule: Date;
}


const TaskSchema : Schema<ITasks> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
     dueTime:{
        type: Date,
        required: true
    },
      schedule:{
        type: Date,
        required: true
    },
},
{ timestamps: true }
);


export default mongoose.model<ITasks>("Task", TaskSchema);
