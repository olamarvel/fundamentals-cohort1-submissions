import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { generateToken } from "../utils/jwt";
import { isNullOrEmpty } from "../utils/utilityFunctions";
import { Account } from "../models/Account";
import { currency } from "../utils/enums";

export class AuthController {
  static async register(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    if(isNullOrEmpty(firstName) || isNullOrEmpty(lastName) || isNullOrEmpty(email) || isNullOrEmpty(password)){
        return res.status(400).json({ message: "fistName, lastName, email and password is required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = (await User.create({ firstName, lastName, email, passwordHash: hashedPassword })).toJSON();
    //NGN account is created by default once the user registers
    const account = (await Account.create({userId: newUser.id, availableBalance: 5000, bookBalance: 5000, currency: currency.NGN})).toJSON()
    const token = generateToken({ id: newUser.id, email: newUser.email, firstName:newUser.firstName });
    return res.status(201).json({
      success: true,  
      message: "success",
      result: {
        user: { id: newUser.id, firstName: newUser.firstName, email: newUser.email },
        token,
        account: account.id
      }
    });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
     if(isNullOrEmpty(email) || isNullOrEmpty(password)){
        return res.status(400).json({success: false, message: "email and password is required" });
    }
    const user = await User.findOne({ raw: true, where: { email : email} });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id, email: user.email, firstName: user.firstName });
    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, firstName: user.firstName, email: user.email },
      token,
    });
  }
}
