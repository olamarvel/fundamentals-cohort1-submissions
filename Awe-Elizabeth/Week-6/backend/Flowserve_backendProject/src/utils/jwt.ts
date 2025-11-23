import jwt from "jsonwebtoken";
import { UserDetails } from "./interface";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const generateToken = (payload: UserDetails) => {
  return jwt.sign(payload!, JWT_SECRET!, { expiresIn: "1hr" });
};


export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
