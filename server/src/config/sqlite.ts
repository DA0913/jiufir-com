import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// 数据库文件路径 ./data/app.db
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'app.db');

// 确保 data 目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 创建并导出数据库实例（若文件不存在将自动创建）
const db = new Database(DB_PATH, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
});

// 通用查询辅助函数
export const run = (sql: string, params: any[] = []) => {
  return db.prepare(sql).run(...params);
};

export const get = <T = any>(sql: string, params: any[] = []): T | undefined => {
  return db.prepare(sql).get(...params) as T | undefined;
};

export const all = <T = any>(sql: string, params: any[] = []): T[] => {
  return db.prepare(sql).all(...params) as T[];
};

// 数据库连接测试函数
export const testSQLiteConnection = (): boolean => {
  try {
    const result = db.prepare('SELECT 1 as test').get();
    console.log('✅ SQLite 数据库连接成功');
    return true;
  } catch (error) {
    console.error('❌ SQLite 数据库连接失败:', error);
    return false;
  }
};

// 优雅关闭数据库连接
export const closeDatabase = () => {
  db.close();
  console.log('🔒 SQLite 数据库连接已关闭');
};

export default db;