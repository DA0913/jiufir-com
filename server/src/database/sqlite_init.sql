-- SQLite 初始化脚本
-- 启用外键支持
PRAGMA foreign_keys = ON;

-- =============================
-- 用户表
-- =============================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
  is_active INTEGER NOT NULL DEFAULT 1, -- 0/1 布尔
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 表单提交表
-- =============================
CREATE TABLE IF NOT EXISTS form_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_types TEXT NOT NULL, -- JSON 字符串
  source_url TEXT NOT NULL,
  submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'invalid')),
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 新闻文章表
-- =============================
CREATE TABLE IF NOT EXISTS news_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  publish_time TEXT NOT NULL,
  image_url TEXT,
  summary TEXT,
  content TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  is_featured INTEGER NOT NULL DEFAULT 0, -- 0/1 布尔
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 客户案例表
-- =============================
CREATE TABLE IF NOT EXISTS customer_cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  company_logo TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT NOT NULL,
  results TEXT NOT NULL,
  metrics TEXT NOT NULL DEFAULT '{}', -- JSON 字符串
  is_featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 案例配置表
-- =============================
CREATE TABLE IF NOT EXISTS case_configurations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  company_name TEXT NOT NULL,
  company_logo TEXT NOT NULL,
  stock_code TEXT,
  image_url TEXT,
  link_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 索引
-- =============================
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_publish_time ON news_articles(publish_time);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_featured ON news_articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_customer_cases_status ON customer_cases(status);
CREATE INDEX IF NOT EXISTS idx_customer_cases_sort_order ON customer_cases(sort_order);
CREATE INDEX IF NOT EXISTS idx_case_configurations_is_active ON case_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_case_configurations_sort_order ON case_configurations(sort_order);