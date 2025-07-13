-- 久火ERP SQLite 初始化脚本
-- 数据库文件: ./data/app.db
-- 注意: SQLite 不支持 UUID, 使用 INTEGER PRIMARY KEY AUTOINCREMENT 作为主键
-- 布尔值统一使用 INTEGER (0 = false, 1 = true)

PRAGMA foreign_keys = ON;

/* =========================
   users 表
   ========================= */
CREATE TABLE IF NOT EXISTS users (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  username        TEXT    NOT NULL UNIQUE,
  email           TEXT    NOT NULL UNIQUE,
  password_hash   TEXT    NOT NULL,
  role            TEXT    NOT NULL DEFAULT 'user',                -- 'admin' | 'user'
  is_active       INTEGER NOT NULL DEFAULT 1,                     -- 1=true,0=false
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

/* =========================
   form_submissions 表
   ========================= */
CREATE TABLE IF NOT EXISTS form_submissions (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name    TEXT    NOT NULL,
  user_name       TEXT    NOT NULL,
  phone           TEXT    NOT NULL,
  company_types   TEXT    NOT NULL,                                -- JSON 字符串
  source_url      TEXT    NOT NULL,
  submitted_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  status          TEXT    NOT NULL DEFAULT 'pending',              -- 'pending' | 'processing' | 'completed' | 'invalid'
  notes           TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

/* =========================
   news_articles 表
   ========================= */
CREATE TABLE IF NOT EXISTS news_articles (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  title           TEXT    NOT NULL,
  category        TEXT    NOT NULL,
  publish_time    TEXT    NOT NULL,                                -- ISO 字符串
  image_url       TEXT,
  summary         TEXT,
  content         TEXT,
  views           INTEGER NOT NULL DEFAULT 0,
  is_featured     INTEGER NOT NULL DEFAULT 0,                      -- 1=true,0=false
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

/* =========================
   customer_cases 表
   ========================= */
CREATE TABLE IF NOT EXISTS customer_cases (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name    TEXT    NOT NULL,
  company_logo    TEXT    NOT NULL,
  industry        TEXT    NOT NULL,
  description     TEXT    NOT NULL,
  results         TEXT    NOT NULL,
  metrics         TEXT    NOT NULL DEFAULT '{}',                   -- JSON 字符串
  is_featured     INTEGER NOT NULL DEFAULT 0,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  status          TEXT    NOT NULL DEFAULT 'active',               -- 'active' | 'inactive'
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

/* =========================
   case_configurations 表
   ========================= */
CREATE TABLE IF NOT EXISTS case_configurations (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  title           TEXT    NOT NULL,
  subtitle        TEXT,
  description     TEXT,
  company_name    TEXT    NOT NULL,
  company_logo    TEXT    NOT NULL,
  stock_code      TEXT,
  image_url       TEXT,
  link_url        TEXT,
  is_active       INTEGER NOT NULL DEFAULT 1,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

/* =========================
   索引
   ========================= */
-- form_submissions
CREATE INDEX IF NOT EXISTS idx_form_submissions_status       ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at   ON form_submissions(created_at);

-- news_articles
CREATE INDEX IF NOT EXISTS idx_news_articles_category        ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_publish_time    ON news_articles(publish_time);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_featured     ON news_articles(is_featured);

-- customer_cases
CREATE INDEX IF NOT EXISTS idx_customer_cases_status         ON customer_cases(status);
CREATE INDEX IF NOT EXISTS idx_customer_cases_sort_order     ON customer_cases(sort_order);

-- case_configurations
CREATE INDEX IF NOT EXISTS idx_case_configurations_is_active ON case_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_case_configurations_sort_order ON case_configurations(sort_order);

/* =========================
   触发器: 自动更新时间戳
   ========================= */
CREATE TRIGGER IF NOT EXISTS trg_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  UPDATE users SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_form_submissions_updated_at
AFTER UPDATE ON form_submissions
FOR EACH ROW
BEGIN
  UPDATE form_submissions SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_news_articles_updated_at
AFTER UPDATE ON news_articles
FOR EACH ROW
BEGIN
  UPDATE news_articles SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_customer_cases_updated_at
AFTER UPDATE ON customer_cases
FOR EACH ROW
BEGIN
  UPDATE customer_cases SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_case_configurations_updated_at
AFTER UPDATE ON case_configurations
FOR EACH ROW
BEGIN
  UPDATE case_configurations SET updated_at = datetime('now') WHERE id = OLD.id;
END;

/* =========================
   默认管理员账户
   ========================= */
INSERT OR IGNORE INTO users (id, username, email, password_hash, role)
VALUES (1, 'admin', 'admin@erp.com', '$2y$10$PLACEHOLDER_HASH_FOR_ADMIN', 'admin');

-- 初始化完成