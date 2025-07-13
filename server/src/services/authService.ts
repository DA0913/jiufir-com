import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { get, run } from '../config/sqlite';
import { User, LoginRequest, LoginResponse, DatabaseResult } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  // 用户登录
  static async login(credentials: LoginRequest): Promise<DatabaseResult<LoginResponse>> {
    try {
      const { username, password } = credentials;

      // 查找用户
      const user = get<User>(
        'SELECT * FROM users WHERE username = ? AND is_active = 1',
        [username]
      );

      if (!user) {
        return {
          success: false,
          error: '用户名或密码错误'
        };
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return {
          success: false,
          error: '用户名或密码错误'
        };
      }

      // 生成 JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // 返回用户信息（不包含密码）
      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        data: {
          token,
          user: userWithoutPassword
        }
      };
    } catch (error) {
      console.error('登录失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '登录失败'
      };
    }
  }

  // 验证 JWT token
  static verifyToken(token: string): { valid: boolean; user?: any; error?: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return {
        valid: true,
        user: decoded
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Token 无效'
      };
    }
  }

  // 根据ID获取用户信息
  static async getUserById(id: number): Promise<DatabaseResult<Omit<User, 'password_hash'>>> {
    try {
      const user = get<User>(
        'SELECT * FROM users WHERE id = ? AND is_active = 1',
        [id]
      );

      if (!user) {
        return {
          success: false,
          error: '用户不存在'
        };
      }

      // 移除密码字段
      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取用户信息失败'
      };
    }
  }

  // 创建用户（管理员功能）
  static async createUser(userData: { username: string; email: string; password: string; role?: 'admin' | 'user' }): Promise<DatabaseResult<Omit<User, 'password_hash'>>> {
    try {
      const { username, email, password, role = 'user' } = userData;

      // 检查用户名是否已存在
      const existingUser = get<User>(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );

      if (existingUser) {
        return {
          success: false,
          error: '用户名或邮箱已存在'
        };
      }

      // 加密密码
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // 插入用户
      const result = run(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, password_hash, role]
      );

      // 获取创建的用户
      const newUser = get<User>(
        'SELECT * FROM users WHERE id = ?',
        [result.lastInsertRowid]
      );

      if (!newUser) {
        return {
          success: false,
          error: '创建用户失败'
        };
      }

      // 移除密码字段
      const { password_hash: _, ...userWithoutPassword } = newUser;

      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('创建用户失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '创建用户失败'
      };
    }
  }
}