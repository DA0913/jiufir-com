import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/authService.js';

const router = Router();

// 注册
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('用户名至少3位'),
  body('email').isEmail().withMessage('邮箱格式不正确'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6位')
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: '数据验证失败', errors: errors.array() });
  }

  const { username, email, password } = req.body;
  const result = await AuthService.register(username, email, password);

  if (result.success) {
    return res.status(201).json({ success: true, data: result.data });
  }
  return res.status(400).json({ success: false, message: result.error });
});

// 登录
router.post('/login', [
  body('username').trim().notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: '数据验证失败', errors: errors.array() });
  }

  const { username, password } = req.body;
  const result = await AuthService.login(username, password);

  if (result.success) {
    return res.json({ success: true, data: result.data });
  }
  return res.status(401).json({ success: false, message: result.error });
});

export default router; 