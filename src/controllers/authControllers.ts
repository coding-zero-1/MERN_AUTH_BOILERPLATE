import { z } from "zod";
import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import generateVerificationCode from "../utils/generateVerificationCode";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }
    const userSchema = z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      email: z.string().email("Invalid email format"),
    });

    const parsedBody = userSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ errors: parsedBody.error.errors });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode(15);
    await User.create({
      username,
      password: hashedPassword,
      email,
      isVerified: false,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("SignIn request body:", req.body);
    const userSchema = z.object({
      email: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .email("Invalid email format"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    });
    const parsedBody = userSchema.safeParse(req.body);
    console.log("Parsed body:", parsedBody);
    if (!parsedBody.success) {
      res.status(400).json({ errors: parsedBody.error.errors });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "User with this email does not exist" });
      return;
    }
    console.log("User found:", user);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Is password valid:", isPasswordValid);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }
    generateTokenAndSetCookie(user._id.toString(), res);

    res.status(200).json({ message: "User signed in successfully" });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
