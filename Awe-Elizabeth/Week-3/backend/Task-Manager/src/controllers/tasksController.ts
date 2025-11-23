import Tasks, {ITasks} from "../models/Tasks";
import { Request, Response } from "express";
import User from "../models/User";

export const getTasks = async(req: Request, res: Response) => {
    try {
          if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
         }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const tasks = await Tasks.find()
        .skip(skip)
        .limit(limit);

        const total = await Tasks.countDocuments();
        
        return res.status(200).json({
            message: "successful",

            result: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                tasks
            }
        })
    }catch(err){
        console.error("Failed to fetch tasks: " + err)
        return res.status(500).json({message: "failed"})
    }
}

export const createTask = async(req: Request, res: Response) => {
    const {title, description, dueTime, schedule} = req.body

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if(!title || !description || !dueTime || !schedule){
        return res.status(400).json({success: false, message: "all fields are required"})
    }
    const user = await User.findById(req?.user.id)
    if(!user){
        return res.status(400).json({success: false, message: "user does not exist"})
    }

    const task =  await Tasks.create({
                        title,
                        description,
                        dueTime: new Date(dueTime),
                        schedule: new Date(schedule),
                        userId: req.user?.id
                    });
    user.Tasks?.push(task._id)
    await user.save();

    return res.status(400).json({success: true, message: "success", result: task})
}

export const searchTasks = async(req: Request, res: Response) => {
    try {
    const { query } = req.body; 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const searchCondition = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    };

    const tasks = await Tasks.find(searchCondition)
      .skip(skip)
      .limit(limit)
    const total = await Tasks.countDocuments(searchCondition);

    res.status(200).json({
      success: true,
      message: "successful",
      resut:{
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: tasks,
      }   
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
