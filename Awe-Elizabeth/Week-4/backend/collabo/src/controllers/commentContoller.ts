import Comments, {IComment} from "../models/Comments";
import mongoose from "mongoose";
import { Request, Response } from "express";
import Posts from "../models/Posts";

export const getPostComments = async (req: Request, res: Response) => {
    if(!req.user)
        return res.status(401).json({success: false, message: "unauthorized"})
    const postId = req.query?.postId
    if(!postId)
        return res.status(400).json({success: false, message: "postId is required"})
    const post = await Posts.findById(postId);
    if(!post)
        return res.status(404).json({success: false, message: "post does not exist"})
    const comments = await Comments.find({postId: postId});
    return res.status(200).json({success: true, message: "successful", result: comments})
}

export const addComment = async (req: Request, res: Response) => {
    const {commentText, postId} = req.body;
    if(!req.user)
       return res.status(401).json({success: false, message: "unauthorized"})
    if(!commentText || !postId || commentText.length < 0)
        return res.status(401).json({success: false, message: "commentText and postId is required"})
    const post = await Posts.findById(postId);
    if(!post)
        return res.status(404).json({success: false, message: "post does not exist"})
    const comment = await Comments.create({
        comment: commentText,
        postId,
        userId: req.user.id
    })

    post.comments.push(comment._id)
    await post.save();
    
    return res.status(201).json({success: true, message: "successful", result: comment})
}