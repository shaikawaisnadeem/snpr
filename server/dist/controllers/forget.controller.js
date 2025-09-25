import prisma from "../prismaClient/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const EMAIL_USER = process.env.EMAIL_USER;
// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
    },
});
/**
 * Step 1: Request Password Reset
 */
export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if user exists
        const user = await prisma.register.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Generate reset token (expires in 15 mins)
        const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
        // Save token & expiry in DB
        await prisma.register.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExp: new Date(Date.now() + 15 * 60 * 1000),
            },
        });
        const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `
        <p>Hello ${email},</p>
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
        });
        res.json({ message: "Reset link sent to your email" });
    }
    catch (error) {
        console.error("Forget Password Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
/**
 * Step 2: Reset Password
 */
// Request password reset
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email is required" });
        const user = await prisma.register.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Generate token
        const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        const resetTokenExp = new Date(Date.now() + 3600000); // 1 hour expiry
        // Save token in DB
        await prisma.register.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExp },
        });
        // Send email
        const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: EMAIL_USER,
            to: email,
            subject: "Password Reset",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Token expires in 1 hour.</p>`,
        });
        res.json({ message: "Password reset email sent" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
//# sourceMappingURL=forget.controller.js.map