import mongoose, { Mongoose, Schema } from 'mongoose'

export interface IComment extends Document{
    userId: mongoose.Types.ObjectId;
    comment: string,
    postId: mongoose.Types.ObjectId
}


const CommentSchema : Schema<IComment> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment:{
        type: String,
        required: true,
        maxLength: [100, "maximum length exceeded"]
    },
      postId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    }
  
},
{ timestamps: true }
);


export default mongoose.model<IComment>("Comment", CommentSchema);


