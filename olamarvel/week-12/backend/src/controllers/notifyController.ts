
import { Request, Response } from "express";

import Job from "../models/job";
import type { JOB } from "../models/job";
import channelPromise, { QUEUE_NAME } from "../config/rabbitmq";


export async function notify(req: Request, res: Response) {
  const notificationData = req.body;
  const jobdata:JOB = {...notificationData,status:'PENDING'}
  const job = await Job.create(jobdata);

  const jobId = job.id;


  const queueName = QUEUE_NAME
  const channel = await channelPromise;
  if(!channel) return
  const isSent = channel.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify(job)),
    { persistent: true }
  );

  if (isSent) {
    // If the message was accepted by the channel buffer
    // console.log(`Job ${jobId} accepted and published.`);
    res.status(202).json({
      message: "Notification job accepted and queued.",
      jobId: jobId
    });
  } else {
    res.status(503).json({
      message: "Queue is busy, please try again."
    });
  }
}

export async function status(req:Request, res: Response) {
  const jobId = req.params.jobId;
  const job = await Job.findById(jobId);
  if(!job) return res.status(404).json({message:'Job not found'});
  res.json(job)
}
