import { Request, Response, NextFunction, Errback } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction 
) => {
  console.error("Error:", err.message);

  if (err.message.includes("unavailable")) {
    return res.status(503).json({
      error: "Legacy system temporarily unavailable",
      retryAfter: 30,
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};

