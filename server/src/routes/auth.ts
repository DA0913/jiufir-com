import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { LoginRequest } from '../types/index.js';

const router = Router();

// 登录验证规则
const validateLogin = [
  body('username').trim().isLength({ min: 1 }).withMessage('用户名不能为空'),
  body('password').isLength({ min: 1 }).withMessage('密码不能为空')
];

// 用户登录
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  try {
    // 检查验证错误
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '登录数据验证失败',
        errors: errors.array()
      });
    }

    const loginData: LoginRequest = {
      username: req.body.username,
      password: req.body.password
    };

    const result = await AuthService.login(loginData);

    if (result.success) {
      res.json({
        success: true,
        message: '登录成功',
        data: result.data
      });
    } else {
      res.status(401).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('登录处理错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 验证 token
router.post('/verify', (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    const verification = AuthService.verifyToken(token);

    if (verification.valid) {
      res.json({
        success: true,
        data: verification.user
      });
    } else {
      res.status(401).json({
        success: false,
        message: verification.error
      });
    }
  } catch (error) {
    console.error('Token验证错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取当前用户信息
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    const verification = AuthService.verifyToken(token);

    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        message: verification.error
      });
    }

    const result = await AuthService.getUserById(verification.user.id);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

export default router; 