import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyToken } from '../utils';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Missing authorization header' });
    return;
  }

  const token = extractToken(authHeader);
  if (!token) {
    res.status(401).json({ error: 'Invalid authorization header format' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.userId = decoded.userId;
  next();
};
