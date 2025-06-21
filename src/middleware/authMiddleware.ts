import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface Authrequest extends Request {
  user?: { userId: string };
}

export const authenticate = (req: Authrequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }
};
