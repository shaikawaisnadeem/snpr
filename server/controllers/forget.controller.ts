import type { Request, Response } from "express";
import prisma from "../prismaClient/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const EMAIL_USER = process.env.EMAIL_USER as string;
const BACKEND_URL = process.env.BACKEND_URL as string;

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
export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.register.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

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
  } catch (error) {
    console.error("Forget Password Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * Step 2: Reset Password
 */

// Request password reset
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and new password required" });

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find user with token and check expiry
    const user = await prisma.register.findFirst({
      where: {
        id: decoded.id,
        resetToken: token,
        resetTokenExp: { gt: new Date() }, // token not expired
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and remove reset token
    await prisma.register.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

