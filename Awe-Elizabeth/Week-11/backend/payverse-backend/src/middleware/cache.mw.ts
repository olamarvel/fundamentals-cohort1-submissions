import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

export const cache = (keyPrefix: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = keyPrefix + (req.params.id || "");

    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // No cache -> continue to controller
    res.locals.cacheKey = key;
    next();
  };
};
