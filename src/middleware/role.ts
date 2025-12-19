import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

export const isSeller = (req: Request, res: Response, next: NextFunction) => {
  const role = (req as any).user.role;
  if (role !== 'admin' && role !== 'seller') {
    return res.status(403).json({ message: 'Access denied. Seller only.' });
  }
  next();
};