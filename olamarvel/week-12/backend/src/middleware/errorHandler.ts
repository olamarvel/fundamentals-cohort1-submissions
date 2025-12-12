import { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

export function errorHandler(
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  let status = err.status || err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  
  if (process.env.NODE_ENV === "production" && status === 500) {
    message = "Something went wrong on our end.";
  }

  console.error({
    level: "error",
    message: err.message,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  res.status(status).json({
    success: false,
    status,
    message,
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}