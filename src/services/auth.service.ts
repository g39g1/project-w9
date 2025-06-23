import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../model/user.model';
import { AppError } from '../utils/error';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const signupService = async (email: string, password: string, role: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const newUser = await User.create({ email, passwordHash, role });
  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

  return {
    userId: newUser._id,
    token,
  };
};

export const signinService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: "1d" });

  return { token };
};
