import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({
      error: {
        message: 'Missing authorization token',
        code: 'MISSING_TOKEN',
      },
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
    
    // Support both userId and id in payload for resilience
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      throw new Error('Token payload missing user identifier');
    }

    req.user = {
      ...decoded,
      userId
    };
    next();
  } catch (err) {
    res.status(401).json({
      error: {
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      },
    });
  }
}

export function optionalAuthenticateToken(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
    
    // Support both userId and id in payload for resilience
    const userId = decoded.userId || decoded.id;
    
    if (userId) {
      req.user = {
        ...decoded,
        userId
      };
    }
    next();
  } catch (err) {
    // For optional auth, we ignore invalid tokens and just don't set req.user
    next();
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      error: {
        message: 'Authentication required',
        code: 'AUTH_REQUIRED',
      },
    });
    return;
  }
  next();
}
