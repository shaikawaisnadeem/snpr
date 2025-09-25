import { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const appPassword = process.env.appPassword;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "awaisn.offi@gmail.com",
    pass: appPassword,
  },
});

//  Forget Password Controller
export const forgetPassword = async (req: Request, res: Response) => {
  try {
    // User comes from middleware (decoded JWT)
    const user = (req as any).user;

    //  Email can be dynamic: from DB, token, or request body
    const mailOptions = {
      from: "awaisn.offi@gmail.com",
      to: user.email, 
      subject: "Password Reset Request",
      text: `Hello ${user.email},\n\nThis is your password reset mail.\n\nIf this wasn't you, ignore this mail.`,
    };

    const info = await transporter.sendMail(mailOptions);

    res.json({ message: "Email sent", response: info.response });
  } catch (error) {
    console.error(" Error sending mail:", error);
    res.status(500).json({ message: "Error sending mail" });
  }
};
