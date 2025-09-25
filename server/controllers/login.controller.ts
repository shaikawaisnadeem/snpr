import bcrypt from 'bcrypt';
import  prisma  from '../prismaClient/prisma.js';
import { loginObj } from '../zod/validator.js';
import type { Request, Response } from 'express';
import { redisClient } from '../redis/redis.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET =  'jwt#secret';

export const loginUser = async (req: Request, res: Response) => {
  // Validate request body with Zod
  const parsedData = loginObj.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(401).json({ message: parsedData.error.issues });
  }

  const { email, password } = parsedData.data;

  try {
    // Check Redis first
    const cachedUser = await redisClient.get(`user:${email}`);
    let user;


    if (cachedUser) {
      user = JSON.parse(cachedUser);
      console.log('User fetched from Redis cache');
    } 
    else {
      // Fetch user from database
      user = await prisma.register.findUnique({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Cache user in Redis
      await redisClient.set(`user:${email}`, JSON.stringify(user));
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, username: user.username, token },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default loginUser;
