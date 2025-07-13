import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { UserService } from '../services/userService.js';
import { authMiddleware } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

const router = Router();

// 登录
router.post(
  '/login',
  [body('username').notEmpty(), body('password').notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, password } = req.body;
    const result = await UserService.authenticate(username, password);

    if (!result.success) {
      return res.status(401).json({ success: false, message: result.error });
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(result.data!, secret, { expiresIn: '7d' });

    return res.json({ success: true, token, user: result.data });
  }
);

// 当前用户信息
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.user });
});

export default router; 