import Posts, {IPosts} from "../model/Post";
import mongoose from "mongoose";
import { Request, Response } from "express";
import logger from "../utils/logger";


export const getPosts = async (req: Request, res: Response) => {
    const posts = await Posts.find();
    return res.status(200).json({success: true, message: "successful", result: posts})
}

export const createPost = async (req: Request, res: Response) => {
    try {
        const {title, description, authorName} = req.body;

        if(!title || !description || !authorName)
            return res.status(401).json({success: false, message: "project post title, description, skill is required"})

        const post = await Posts.create({
        title,
        description,
        authorName
        });

        return res.status(201).json({success: true, message: "successful", result: post})
    } catch (error) {
        logger.error(`error creating post: ${error}`)
    }
}