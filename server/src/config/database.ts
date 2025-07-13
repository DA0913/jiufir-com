import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

/*
 * 该文件原本使用 pg 连接 PostgreSQL。
 * 为了消除外部依赖，改用 SQLite（better-sqlite3 同步驱动）。
 * 对外仍暴露 query() 与 testConnection()，保持其他 Service 不变。
 */

const dbPath = path.resolve(process.cwd(), 'erp.sqlite');
const isFirstRun = !fs.existsSync(dbPath);

const db = new Database(dbPath);

// 将形如 $1、$2 的占位符替换成 SQLite 的 ? 占位符
function convertPlaceholders(sql: string) {
  return sql.replace(/\$\d+/g, '?');
}

export async function query(text: string, params: any[] = []) {
  const sql = convertPlaceholders(text);
  const stmt = db.prepare(sql);
  const isSelect = /^\s*select/i.test(sql);

  if (isSelect) {
    const rows = stmt.all(...params);
    return { rows, rowCount: rows.length };
  }
  const info = stmt.run(...params);
  // better-sqlite3 对 INSERT/UPDATE 返回 .changes
  return { rows: [], rowCount: info.changes };
}

export async function testConnection() {
  try {
    db.prepare('SELECT 1').get();
    return true;
  } catch (e) {
    console.error('SQLite 连接测试失败:', e);
    return false;
  }
}

// 初始化表结构（仅首次生成数据库文件时）
if (isFirstRun) {
  const schema = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT,
    password_hash TEXT,
    role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT,
    user_name TEXT,
    phone TEXT,
    company_types TEXT,
    source_url TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE news_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    summary TEXT,
    content TEXT,
    author TEXT,
    cover_image TEXT,
    is_top INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`;
  db.exec(schema);
  console.log('✅ 已初始化 SQLite 数据库表结构 ->', dbPath);
} 