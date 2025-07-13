import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 数据库文件路径
const dbPath = path.resolve(process.cwd(), 'erp.sqlite');
const firstRun = !fs.existsSync(dbPath);
const db = new Database(dbPath);

// 将 $1、$2… 占位符替换为 SQLite 的 ?
const conv = (sql: string) => sql.replace(/\$\d+/g, '?');

export interface QueryResult {
  rows: any[];
  rowCount: number;
}

export async function query(sql: string, params: any[] = []): Promise<QueryResult> {
  const stmt = db.prepare(conv(sql));
  if (/^\s*select/i.test(sql)) {
    const rows = stmt.all(...params);
    return { rows, rowCount: rows.length };
  }
  const info = stmt.run(...params);
  return { rows: [], rowCount: info.changes };
}

export async function testConnection() {
  try {
    db.prepare('SELECT 1').get();
    return true;
  } catch {
    return false;
  }
}

// 首次运行自动建表 + 插入示例数据
if (firstRun) {
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT,
      password_hash TEXT,
      role TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS form_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT,
      user_name TEXT,
      phone TEXT,
      company_types TEXT,
      source_url TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS news_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      summary TEXT,
      content TEXT,
      author TEXT,
      cover_image TEXT,
      is_top INTEGER DEFAULT 0,
      status TEXT DEFAULT 'draft',
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ SQLite 已初始化 →', dbPath);
}