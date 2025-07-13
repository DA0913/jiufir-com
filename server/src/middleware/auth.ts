import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../types/index.js';

// JWT 认证中间件
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get('authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '访问被拒绝，需要认证令牌'
    });
  }

  const verification = AuthService.verifyToken(token);

  if (!verification.valid) {
    return res.status(403).json({
      success: false,
      message: verification.error || '无效的认证令牌'
    });
  }

  // 将用户信息添加到请求对象
  req.user = verification.user;
  next();
};

// 管理员权限中间件
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '未认证用户'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '需要管理员权限'
    });
  }

  next();
};

// 可选认证中间件（不强制要求认证）
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const verification = AuthService.verifyToken(token);
    if (verification.valid) {
      req.user = verification.user;
    }
  }

  next();
};