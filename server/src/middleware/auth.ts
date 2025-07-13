import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/index.js';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = (req.headers['authorization'] as string | undefined) || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return res.status(401).json({ success: false, message: '未提供身份令牌' });
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret);

    // 令牌有效
    req.user = decoded as any;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: '身份验证失败' });
  }
};