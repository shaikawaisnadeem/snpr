import type{ Request, Response } from "express";
import prisma from "../prismaClient/prisma.js";
import { redisClient } from "../redis/redis.js";

export const getUser = async (req: Request, res: Response) => {
  try {
    const email = (req as any).user.email; // comes from middleware

    // Check Redis
    const cachedUser = await redisClient.get(`user:${email}`);
    let user;

    if (cachedUser) {
      user = JSON.parse(cachedUser);
      console.log("User fetched from Redis cache");
    } else {
      user = await prisma.register.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await redisClient.set(`user:${email}`, JSON.stringify(user));
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
