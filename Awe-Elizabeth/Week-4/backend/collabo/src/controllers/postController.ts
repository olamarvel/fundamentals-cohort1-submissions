import Posts, {IPosts} from "../models/Posts";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { projectSkills,projectSkillLevel } from "../utilities/enums/skills";
import { userInfo } from "os";
import User from "../models/User";

export const getPosts = async (req: Request, res: Response) => {
    if(!req.user)
        return res.status(401).json({success: false, message: "unauthorized"})
    const posts = await Posts.find();
    return res.status(200).json({success: true, message: "successful", result: posts})
}

export const createPost = async (req: Request, res: Response) => {
    const {title, description, skills, skillLevel, photos} = req.body;
    if(!req.user)
       return res.status(401).json({success: false, message: "unauthorized"})
    const user = await User.findById(req.user.id)
    if(!user)
       return res.status(404).json({success: false, message: "user does not exist"})
    if(!title || !description || !skills)
        return res.status(401).json({success: false, message: "project post title, description, skill is required"})

    var storedSkills : Array<projectSkills> = []
    skills.forEach((skill: any) => {
        if (!Object.values(projectSkills).includes(skill.toLowerCase())) {
            return res.status(400).json({ sucess: false, message: `Invalid skill provided: ${skill}` });
        }
        storedSkills.push(skill.toLowerCase())
    });
    if(skillLevel){
        skillLevel.forEach((level: any) => {
        if (!Object.values(projectSkillLevel).includes(level.toLowerCase())) {
            return res.status(400).json({ sucess: false, message: `Invalid level provided: ${level}` });
        }
    });
    }

    let postImages: any[] =  []
    if(photos){
        photos.array.forEach((photo: string) => {
            postImages.push(photo)
        });
    }

    const post = await Posts.create({
       userId: req.user._id,
       title,
       description,
       photos: postImages,
       skills: storedSkills,
       skillLevel,
       authorName: `${user.firstName} ${user.lastName}`
    });

    return res.status(201).json({success: true, message: "successful", result: post})

}

export const getUserPosts = async (req: Request, res: Response) => {
    if(!req.user)
        return res.status(401).json({success: false, message: "unauthorized"})
    const posts = await Posts.find({userId: req.user._id});
    return res.status(200).json({success: true, message: "successful", result: posts})
}