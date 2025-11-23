import { Request, Response, NextFunction } from "express";

export const requestTimer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const duration = (diff[0] * 1e9 + diff[1]) / 1e6; // 
    console.log(
      `[${req.method}] ${req.originalUrl} - ${
        res.statusCode
      } - ${duration.toFixed(2)}ms`
    );
  });

  next();
};
