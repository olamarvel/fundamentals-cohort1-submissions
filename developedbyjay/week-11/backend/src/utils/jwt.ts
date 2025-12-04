import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: string): string => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES as any,
    subject: "accessToken",
  });
  return token;
};

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, {
    algorithms: ["HS256"],
  });
}
