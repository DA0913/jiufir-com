import { get } from '../config/sqlite';
import bcrypt from 'bcryptjs';
import { User, DatabaseResult } from '../types/index.js';

export class UserService {
  static async authenticate(usernameOrEmail: string, password: string): Promise<DatabaseResult<Omit<User, 'password_hash'>>> {
    try {
      const user = get<User>(
        `SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1`,
        [usernameOrEmail, usernameOrEmail]
      );

      if (!user) {
        return { success: false, error: '用户不存在' };
      }

      const isMatch = bcrypt.compareSync(password, user.password_hash);
      if (!isMatch) {
        return { success: false, error: '密码错误' };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...safeUser } = user;
      return { success: true, data: safeUser };
    } catch (error) {
      console.error('用户认证失败:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  static async getUserById(id: string): Promise<DatabaseResult<Omit<User, 'password_hash'>>> {
    try {
      const user = get<User>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      if (!user) return { success: false, error: '用户不存在' };
      const { password_hash, ...safeUser } = user;
      return { success: true, data: safeUser };
    } catch (error) {
      console.error('查询用户失败:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}