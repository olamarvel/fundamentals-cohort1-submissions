import mongoose, { Mongoose, Schema } from 'mongoose'
import { projectSkillLevel, projectSkills } from '../utilities/enums/skills';

export interface IPosts extends Document{
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    authorName: string;
    photos: Array<string | null>;
    comments: Array<mongoose.Types.ObjectId>,
    skills: Array<projectSkills>,
    skillLevel: Array<projectSkillLevel>
}


const PostSchema : Schema<IPosts> = new Schema({
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
    authorName:{
        type: String,
        required: true
    },
    photos:{
        type:  Array,
        required: false,
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    }],
    skills: {
        type: [String],
        enum: Object.values(projectSkills),
        required: true
    },
    skillLevel: {
        type: [String],
        enum: Object.values(projectSkillLevel),
        required: false
    }
},
{ timestamps: true }
);


export default mongoose.model<IPosts>("Post", PostSchema);
