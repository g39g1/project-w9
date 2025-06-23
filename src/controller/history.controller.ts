import { Request, Response } from 'express';
import { getLogs } from '../services/logs.service';  

export const Logs = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];  

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized: No token provided'
      });
      return;
    }

    const result = await getLogs(token);  

    if (result.error) {
       res.status(result.statusCode).json({ error: result.error });
       return;
    }

    res.status(200).json({
      success: true,
      logs: result.logs
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to retrieve user logs',
      details: error.message
    });
  }
};
