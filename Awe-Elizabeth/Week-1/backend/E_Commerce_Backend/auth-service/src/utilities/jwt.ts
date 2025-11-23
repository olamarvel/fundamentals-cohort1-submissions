import jwt from "jsonwebtoken";
import { userDetails } from "./interface/userDatails";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "super" 
const JWT_EXPIRES_IN = "1h";

export const generateToken = (userDetails: userDetails) => {
  return jwt.sign({ userDetails }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
