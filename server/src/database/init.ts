import { readFileSync } from 'fs';
import path from 'path';
import { db } from '../config/sqlite';

export const initDatabase = (): void => {
  try {
    const initPath = path.join(process.cwd(), 'src', 'database', 'sqlite_init.sql');
    const sql = readFileSync(initPath, 'utf-8');
    db.exec(sql);
    console.log('✅ SQLite 数据库初始化完成');
  } catch (error) {
    console.error('❌ SQLite 初始化失败:', error);
    throw error;
  }
};