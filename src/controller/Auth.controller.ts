import { Request, Response } from 'express';
import { signupService, signinService } from '../services/auth.service';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;
    const result = await signupService(email, password, role);
    res.status(201).json(result);
  } catch (err: any) {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Something went wrong";
    res.status(statusCode).json({ error: message });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await signinService(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Something went wrong";
    res.status(statusCode).json({ error: message });
  }
};
