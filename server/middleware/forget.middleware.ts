import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const headers = req.headers.authorization;
    if (!headers || !headers.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = headers.split(" ")[1];
    const decoded = jwt.verify(token as string, JWT_SECRET);

    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
