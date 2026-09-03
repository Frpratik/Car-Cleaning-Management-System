import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '@prisma/client';

export interface AuthenticatedUserPayload {
  userId: string;
  role: UserRole;
  societyId?: string | null;
  email?: string | null;
  phoneNumber: string;
  fullName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
      societyId?: string;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ')) 
    ? authHeader.split(' ')[1] 
    : (req.cookies && req.cookies.token);

  if (!token) {
    res.status(401).json({ success: false, error: 'Unauthorized: Authentication token missing.' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUserPayload;
    req.user = payload;
    if (payload.societyId) {
      req.societyId = payload.societyId;
    }
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Unauthorized: Token is invalid or expired.' });
  }
};

export const requireRoles = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized: Authentication required.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: User role '${req.user.role}' lacks permission for this resource.`
      });
      return;
    }

    next();
  };
};
