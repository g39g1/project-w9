import { JwtPayload } from 'jsonwebtoken';
import History from '../model/History.model';
import { verifyToken } from '../utils/verifyToken';  

export const getLogs = async (token: string) => {
  try {
    const verify = verifyToken(token);
    if (!verify || !(verify as JwtPayload).userId) {
      return {
        error: 'Unauthorized: Invalid or expired token',
        statusCode: 401,
      };
    }

    const userIdentifier = (verify as JwtPayload).userId;

    const logs = await History.find({ user: userIdentifier })
      .populate('weather')
      .sort({ timestamp: -1 });

    if (logs.length === 0) {
      return {
        error: 'No logs found for this user.',
        statusCode: 404,
      };
    }

    return {
      logs,
    };
  } catch (error: any) {
    console.error(error);
    return {
      error: 'Failed to retrieve user logs',
      statusCode: 500,
    };
  }
};
