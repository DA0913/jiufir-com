import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { get, run } from '../config/sqlite.js';
import { User, DatabaseResult, LoginResponse } from '../types/index.js';

// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  /** 生成 JWT */
  static generateToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /** 用户注册 */
  static async register(username: string, email: string, password: string): Promise<DatabaseResult<LoginResponse>> {
    try {
      // 检查重名/重复邮箱
      const existing = get<User>('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
      if (existing) {
        return { success: false, error: '用户名或邮箱已存在' };
      }

      // 密码 hash
      const passwordHash = bcrypt.hashSync(password, 10);

      // 插入用户 (默认 role=user)
      const insert = run(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, passwordHash, 'user']
      );

      // 获取插入后的用户
      const user = get<User>('SELECT id, username, email, role, is_active, created_at, updated_at FROM users WHERE id = ?', [insert.lastInsertRowid]);

      if (!user) {
        return { success: false, error: '创建用户失败' };
      }

      const token = this.generateToken({ id: user.id, username: user.username, role: user.role });

      return {
        success: true,
        data: {
          token,
          user
        }
      };
    } catch (err) {
      console.error('注册失败:', err);
      return { success: false, error: '服务器错误' };
    }
  }

  /** 用户登录 */
  static async login(usernameOrEmail: string, password: string): Promise<DatabaseResult<LoginResponse>> {
    try {
      const user = get<User>('SELECT * FROM users WHERE username = ? OR email = ?', [usernameOrEmail, usernameOrEmail]);
      if (!user) {
        return { success: false, error: '用户不存在' };
      }

      // 密码校验
      const isMatch = bcrypt.compareSync(password, (user as any).password_hash);
      if (!isMatch) {
        return { success: false, error: '密码错误' };
      }

      const token = this.generateToken({ id: user.id, username: user.username, role: user.role });

      const { password_hash, ...safeUser } = user as any;

      return {
        success: true,
        data: {
          token,
          user: safeUser
        }
      };
    } catch (err) {
      console.error('登录失败:', err);
      return { success: false, error: '服务器错误' };
    }
  }

  /** 验证令牌 */
  static verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  }
}