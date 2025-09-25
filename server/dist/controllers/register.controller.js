import bcrypt from 'bcrypt';
import prisma from '../prismaClient/prisma.js';
import { registerObject } from '../zod/validator.js';
import { redisClient } from '../redis/redis.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'jwt#secret';
export const registerUser = async (req, res) => {
    // Validate with Zod
    const parsedData = registerObject.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(401).json({
            message: parsedData.error.issues,
        });
    }
    const { email, username, password, confirmpassword } = parsedData.data;
    // Check if passwords match
    if (password !== confirmpassword) {
        return res.status(401).json({ message: "Passwords do not match" });
    }
    try {
        // Check if user already exists
        const existingUser = await prisma.register.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = await prisma.register.create({
            data: {
                email: email,
                username: username,
                password: hashedPassword,
            },
        });
        // Store user in Redis with unique key
        await redisClient.set(`user:${newUser.email}`, JSON.stringify(newUser));
        // Generate JWT token
        const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1d' });
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser.id, email: newUser.email, username: newUser.username, token },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export default registerUser;
//# sourceMappingURL=register.controller.js.map