
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './router/auth.router';  
import weatherRoutes from './router/weather.router';  
import historyRoutes from './router/history.router';  

import logger from './utils/logger'; 
import { connectDB } from './config/database';  

dotenv.config();

connectDB();

const app: Express = express();

app.use(cors());               
app.use(helmet());             
app.use(morgan('tiny'));       
app.use(express.json());       
app.use(express.urlencoded({ extended: true })); 

app.use('/auth', authRoutes);  

app.use('/weather', weatherRoutes);  

app.use('/history', historyRoutes);  

app.get('/', (req: Request, res: Response) => {

  res.status(200).json({ message: 'Welcome to the WeatherHub API!' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
