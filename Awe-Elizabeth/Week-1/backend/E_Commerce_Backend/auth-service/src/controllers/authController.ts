import { Request, Response } from "express";
import User, {IUser} from "../models/User";
import { UserRole } from "../utilities/enums/userRole";
import {publishToQueue} from "../events/connection"
import { json } from "stream/consumers";
import { eventNames } from "process";
import { generateToken } from "../utilities/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if(!email || !password || !firstName || !lastName){
      return res.status(400).json({ message: "all fields are required"});
    }

    if(password.length < 6){
      return res.status(400).json({ message: "password must be at least six characters"});
    }
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || UserRole.User, // default to User
    });
    await user.save();
    const token = generateToken({id: user._id, firstName: user.firstName, lastName: user.lastName});

    publishToQueue("user_events", {event: "USER_CREATED", data:{userId: user._id}})

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      result: { 
        id: user._id,
        email: user.email,
        firstName: user.firstName, 
        lastName:user.lastName, 
        role: user.role, 
        cartId: user.cartId,
        createdAt: user.createdAt, 
        updatedAt: user.updatedAt 
        },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // TODO: Generate JWT (placeholder for now)
    const token = generateToken({id: user._id, firstName: user.firstName, lastName: user.lastName});
    return res.json({
      success: true,
      message: "Login successful",
      result: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, cartId: user?.cartId },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
