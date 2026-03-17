import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { JWT_SECRET, APP_CONFIG } from "../config/env.js";
import { sendWelcomeEmail } from "../services/emailService.js";

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: APP_CONFIG.jwtExpiresIn }
  );

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.create({ name, email, password });
    const token = signToken(user);
    
    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with registration even if email fails
    }
    
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  console.log('Login request received:', req.method, req.url);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  try {
    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email });
    console.log('Found user:', user ? 'yes' : 'no');
    
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    console.log('User found, comparing password...');
    
    if (!user.password) {
      console.log('User has no password hash');
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Use direct bcrypt comparison for reliability
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', passwordMatch);
    
    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const token = signToken(user);
    console.log('Login successful for:', email);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "If the email exists, a reset link was sent" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    // In production, send email with this token; for now, return it for testing
    return res.json({ message: "Reset token generated", token });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const googleCallbackHandler = async (req, res) => {
  try {
    // Passport will attach user to req.user
    const user = req.user;
    
    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL || "https://mobile-frontend-tau.vercel.app"}/login?error=auth_failed`
      );
    }
    
    const token = signToken(user);
    
    // Redirect to frontend callback page with token
    const frontendUrl = process.env.FRONTEND_URL || "https://mobile-frontend-tau.vercel.app";
    const callbackUrl = `${frontendUrl}/auth/google/callback?token=${encodeURIComponent(token)}`;
    
    return res.redirect(callbackUrl);
  } catch (err) {
    console.error("Google callback error:", err);
    const frontendUrl = process.env.FRONTEND_URL || "https://mobile-frontend-tau.vercel.app";
    return res.redirect(
      `${frontendUrl}/login?error=${encodeURIComponent(err.message)}`
    );
  }
};

export const getProfile = async (req, res) => {
  return res.json({ user: req.user });
};

