import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// 数据库文件路径 ./data/app.db
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'app.db');

// 确保 data 目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
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

export default db;