import Database, { Database as DatabaseType } from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// 确保数据目录存在
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// SQLite 数据库文件路径
const dbPath = join(dataDir, 'app.db');

// 创建 SQLite 数据库连接
const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
  fileMustExist: false // 如果数据库文件不存在则创建
});

// 设置数据库配置
db.pragma('journal_mode = WAL'); // 使用 WAL 模式提高性能
db.pragma('synchronous = NORMAL'); // 平衡性能和数据完整性
db.pragma('cache_size = 1000'); // 设置缓存大小
db.pragma('temp_store = memory'); // 临时存储在内存中
db.pragma('mmap_size = 268435456'); // 256MB 内存映射

// 数据库连接测试函数
export const testConnection = (): boolean => {
  try {
    const result = db.prepare("SELECT datetime('now') as now").get();
    console.log('✅ SQLite 数据库连接测试成功:', result);
    return true;
  } catch (error) {
    console.error('❌ SQLite 数据库连接测试失败:', error);
    return false;
  }
};

// 执行查询的通用函数 (SELECT 查询)
export const query = (text: string, params?: any[]): any => {
  try {
    const stmt = db.prepare(text);
    const result = stmt.all(params || []);
    console.log('📊 执行查询:', { text, params, count: result.length });
    return { rows: result };
  } catch (error) {
    console.error('❌ 查询执行失败:', error);
    throw error;
  }
};

// 执行单行查询
export const queryOne = (text: string, params?: any[]): any => {
  try {
    const stmt = db.prepare(text);
    const result = stmt.get(params || []);
    console.log('📊 执行单行查询:', { text, params, found: !!result });
    return { rows: result ? [result] : [] };
  } catch (error) {
    console.error('❌ 单行查询执行失败:', error);
    throw error;
  }
};

// 执行插入/更新/删除操作
export const execute = (text: string, params?: any[]): any => {
  try {
    const stmt = db.prepare(text);
    const result = stmt.run(params || []);
    console.log('📊 执行操作:', { text, params, changes: result.changes, lastInsertRowid: result.lastInsertRowid });
    return { 
      rows: [], 
      changes: result.changes, 
      lastInsertRowid: result.lastInsertRowid 
    };
  } catch (error) {
    console.error('❌ 操作执行失败:', error);
    throw error;
  }
};

// 事务支持
export const transaction = (fn: () => void) => {
  return db.transaction(fn);
};

// 关闭数据库连接
export const closeDatabase = () => {
  db.close();
};

// 在进程退出时关闭数据库
process.on('exit', () => {
  closeDatabase();
});

process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

export default db as DatabaseType; 