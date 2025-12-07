import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.ts";
import { redis } from "../config/redis.ts";
import { AppError } from "../utils/error.ts";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AppError("Access Token missing", 401));
  }

  try {
    const token = authorization!.split(" ")[1];
    const decoded = verifyToken(token) as { userId: string };

    if (!decoded || !decoded.userId) {
      return next(new AppError("Invalid Access Token", 401));
    }

    const isBlacklisted = await redis.sismember(`jwt_blacklist`, token);

    if (isBlacklisted) {
      return next(new AppError("Access Token revoked", 401));
    }

    (req as any).userId = decoded.userId;
    next();
  } catch (err) {
    return next(new AppError("Invalid Access Token", 401));
  }
}
