import { Router } from 'express';
const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.json({
      success: true,
      token: 'mock-token',
      user: { id: 1, username: 'admin', role: 'admin' }
    });
  }
  return res.status(401).json({ success: false, message: '用户名或密码错误' });
});

export default router; 