import { Request, Response } from 'express';
import History from '../model/History.model';
import { verifyToken } from '../utils/verifyToken';  
import { JwtPayload } from 'jsonwebtoken';  
export const Logs = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];  
    if (!token) {
       res.status(401).json({
        error: 'Unauthorized: No token provided'
      });
      return
    }

    const verify = verifyToken(token);
    if (!verify || !(verify as JwtPayload).userId) {
       res.status(401).json({
        error: 'Unauthorized: Invalid or expired token'
      });
      return
    }

    const userIdentifier = (verify as JwtPayload).userId;

    const logs = await History.find({ user: userIdentifier })
      .populate('weather')
      .sort({ timestamp: -1 });

    if (!logs || logs.length === 0) {
       res.status(404).json({
        success: false,
        error: 'No logs found for this user.'
      });
      return
    }

     res.status(200).json({
      success: true,
      logs: logs
    });

  } catch (error: any) {
     res.status(500).json({
      error: 'Failed to retrieve user logs',
      details: error.message
    });
    return
  }
};
