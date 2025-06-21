import { Request, Response } from 'express';
import History from '../model/History.model'

export const Logs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userIdentifier = (req as any).user.userId;  

    const logs = await History.find({ user: userIdentifier })
      .populate('weatherDetails')  
      .sort({ timestamp: -1 });  

    res.status(200).json(logs);  
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to retrieve user logs',
      details: error.message
    });
  }
};
