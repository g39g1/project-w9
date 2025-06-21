import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../model/user.model';
import { AppError } from '../utils/error'; 

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role = 'user' } = req.body;

    const useer = await User.findOne({ email });
    if (useer) {
      throw new AppError("Email already registered", 400);   
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({ email, passwordHash, role });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      userId: user._id,
      token,
    });
  } catch (err: any) {
    res.status(500)
    .json({ error: err.message });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
         
        error: "Email and password are required",
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        
        error: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        
        error: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign({ userId: String(user._id) }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
     
      token,
    });
  } catch (error) {
    res.status(500).json({
      
      error: "Failed to sign in",
    });
  }
};

export const signout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: "Successfully signed out",
    });
  } catch (error) {
    res.status(500).json({
      
      error: "Failed to sign out",
    });
  }
};
