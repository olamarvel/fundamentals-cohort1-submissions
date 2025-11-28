import mongoose, { Mongoose, Schema } from 'mongoose'

export interface IPosts extends Document{
    title: string;
    description: string;
    authorName: string;
    photos: Array<string | null>;
}

const PostSchema : Schema<IPosts> = new Schema (
    {
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
    },
    {timestamps: true}
)

export default mongoose.model<IPosts>("Post", PostSchema);
