import type { Request, Response, NextFunction } from 'express';
import type { DemoUser, Role } from './domain.js';

declare module 'express-session' {
  interface SessionData { userId?: string; }
}

declare global {
  namespace Express {
    interface Request { currentUser?: DemoUser; }
  }
}

export function requireAuth(users: DemoUser[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = users.find(u => u.id === req.session.userId);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    req.currentUser = user;
    next();
  };
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser || !roles.includes(req.currentUser.role)) {
      return res.status(403).json({ error: 'Not authorised for this action' });
    }
    next();
  };
}
