import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "jwt#secret"

export const forgetMiddleware = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const headers = req.headers.authorization
    if (!headers || !headers.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = headers.split(" ")[1]

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };

    (req as any).user = decoded
    next()
    }
    catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
    }
}