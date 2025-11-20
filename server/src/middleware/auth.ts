import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type UserRole = 'admin' | 'employee' | 'client';

export type AuthUser = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  avatarUrl?: string;
  role: UserRole;
};

const JWT_SECRET = env.jwtSecret;

export const signToken = (payload: AuthUser) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: '12h',
  });

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification failed', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorizeRoles =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };

