import mongoose from "mongoose";
import logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = "mongodb+srv://khaled:khaled@cluster0.lodch9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    if (!mongoURI) {
      logger.error('MONGODB_URI is not defined');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};


