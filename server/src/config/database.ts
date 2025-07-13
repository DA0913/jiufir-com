import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'erp.sqlite');
const isFirstRun = !fs.existsSync(dbPath);
const db = new Database(dbPath);

// 把 $1、$2 占位符改成 ?
function convert(sql: string) {
  return sql.replace(/\$\d+/g, '?');
}

export async function query(text: string, params: any[] = []) {
  const sql = convert(text);
  const stmt = db.prepare(sql);
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

// 首次启动建表
if (isFirstRun) {
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
  console.log('✅ 已初始化 SQLite 数据库表结构 ->', dbPath);
}