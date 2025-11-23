import { Request, Response } from "express";
import { register } from "../metrics/promMetrics";

export const getMetrics = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
};
