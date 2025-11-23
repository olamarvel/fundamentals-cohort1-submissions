import { Request, Response, NextFunction } from "express";
import {
  totalRequests,
  totalErrors,
  responseTime,
} from "../metrics/promMetrics";

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const end = responseTime.startTimer();

  totalRequests.inc();

  res.on("finish", () => {
    end();

    if (res.statusCode >= 400) {
      totalErrors.inc();
    }
  });

  next();
};
