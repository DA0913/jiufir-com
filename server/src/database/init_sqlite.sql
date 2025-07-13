-- SQLite 数据库初始化脚本
-- 从 PostgreSQL 迁移到 SQLite

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 创建表单提交表
CREATE TABLE IF NOT EXISTS form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    user_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_types TEXT NOT NULL, -- JSON 字符串
    source_url TEXT NOT NULL,
    submitted_at TEXT DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'invalid')),
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 创建新闻文章表
CREATE TABLE IF NOT EXISTS news_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    publish_time TEXT NOT NULL,
    image_url TEXT,
    summary TEXT,
    content TEXT,
    views INTEGER NOT NULL DEFAULT 0,
    is_featured INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 创建客户案例表
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
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 创建案例配置表
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
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_publish_time ON news_articles(publish_time);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_featured ON news_articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_customer_cases_status ON customer_cases(status);
CREATE INDEX IF NOT EXISTS idx_customer_cases_sort_order ON customer_cases(sort_order);
CREATE INDEX IF NOT EXISTS idx_case_configurations_is_active ON case_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_case_configurations_sort_order ON case_configurations(sort_order);

-- 插入默认管理员用户 (密码: admin123)
INSERT OR IGNORE INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@erp.com', '$2a$10$rQZ8K9mN2pL3vX7yJ1hF4eR6tY8uI0oP1qA2sB3cD4eF5gH6iJ7kL8mN9oP0', 'admin');

-- 插入示例新闻数据
INSERT OR IGNORE INTO news_articles (title, category, publish_time, summary, content, is_featured) VALUES 
('ERP系统升级公告', '系统公告', datetime('now'), '我们即将推出全新的ERP系统升级版本', '详细内容...', 1),
('行业趋势分析', '行业资讯', datetime('now'), '2024年制造业发展趋势分析', '详细内容...', 0);

-- 插入示例客户案例
INSERT OR IGNORE INTO customer_cases (company_name, company_logo, industry, description, results, metrics, is_featured, sort_order) VALUES 
('示例公司A', '/images/logo-a.png', '制造业', '通过ERP系统实现了生产效率提升30%', '生产效率显著提升，成本降低20%', '{"efficiency": 30, "cost_reduction": 20}', 1, 1),
('示例公司B', '/images/logo-b.png', '贸易业', 'ERP系统帮助优化了供应链管理', '库存周转率提升50%，订单处理时间缩短40%', '{"inventory_turnover": 50, "order_processing": 40}', 1, 2);