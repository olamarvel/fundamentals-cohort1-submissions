import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

/**
 * HTTP request logging middleware
 * Tracks response time and logs with appropriate level based on status code
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel =
      res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    logger[logLevel](
      {
        req: {
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
        },
        res: {
          status: res.statusCode,
        },
        duration,
      },
      "HTTP Request"
    );
  });

  next();
};
