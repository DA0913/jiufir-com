-- 久火ERP数据库初始化脚本
-- 从PostgreSQL迁移到SQLite

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6)))),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建用户表的触发器（自动更新时间戳）
CREATE TRIGGER IF NOT EXISTS users_updated_at
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- 创建表单提交表
CREATE TABLE IF NOT EXISTS form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6)))),
    company_name TEXT NOT NULL,
    user_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_types TEXT NOT NULL, -- SQLite中使用TEXT存储JSON
    source_url TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'invalid')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建表单提交表的触发器
CREATE TRIGGER IF NOT EXISTS form_submissions_updated_at
    AFTER UPDATE ON form_submissions
    FOR EACH ROW
    BEGIN
        UPDATE form_submissions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- 创建新闻文章表
CREATE TABLE IF NOT EXISTS news_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6)))),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    publish_time DATETIME NOT NULL,
    image_url TEXT,
    summary TEXT,
    content TEXT,
    views INTEGER NOT NULL DEFAULT 0,
    is_featured INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建新闻文章表的触发器
CREATE TRIGGER IF NOT EXISTS news_articles_updated_at
    AFTER UPDATE ON news_articles
    FOR EACH ROW
    BEGIN
        UPDATE news_articles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- 创建客户案例表
CREATE TABLE IF NOT EXISTS customer_cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6)))),
    company_name TEXT NOT NULL,
    stock_code TEXT,
    logo_url TEXT,
    description TEXT,
    industry TEXT NOT NULL,
    company_size TEXT NOT NULL,
    key_benefits TEXT NOT NULL, -- JSON存储
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建客户案例表的触发器
CREATE TRIGGER IF NOT EXISTS customer_cases_updated_at
    AFTER UPDATE ON customer_cases
    FOR EACH ROW
    BEGIN
        UPDATE customer_cases SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- 创建案例配置表
CREATE TABLE IF NOT EXISTS case_configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6)))),
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建案例配置表的触发器
CREATE TRIGGER IF NOT EXISTS case_configurations_updated_at
    AFTER UPDATE ON case_configurations
    FOR EACH ROW
    BEGIN
        UPDATE case_configurations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_publish_time ON news_articles(publish_time);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_featured ON news_articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_customer_cases_industry ON customer_cases(industry);
CREATE INDEX IF NOT EXISTS idx_customer_cases_is_active ON customer_cases(is_active);
CREATE INDEX IF NOT EXISTS idx_case_configurations_is_active ON case_configurations(is_active);

-- 插入默认管理员用户
INSERT OR IGNORE INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@jiufire.com', '$2b$10$8F8yX8vHfgxNyTxHfyQXO.KqN8F8yX8vHfgxNyTxHfyQXO.KqN8F8', 'admin');

-- 插入测试数据
INSERT OR IGNORE INTO news_articles (title, category, publish_time, summary, content, is_featured) VALUES
('久火ERP系统正式上线', '公司新闻', '2024-01-15 10:00:00', '久火ERP系统经过长期开发和测试，正式上线运营。', '详细内容...', 1),
('制造业数字化转型趋势', '行业资讯', '2024-01-10 14:30:00', '分析制造业数字化转型的最新趋势和发展方向。', '详细内容...', 1),
('ERP系统选型指南', '技术文章', '2024-01-05 09:15:00', '企业如何选择适合自己的ERP系统。', '详细内容...', 0);

INSERT OR IGNORE INTO customer_cases (company_name, stock_code, description, industry, company_size, key_benefits) VALUES
('泰山石膏', '000877', '建材行业ERP解决方案', '建材', '大型企业', '["生产效率提升30%", "库存成本降低25%", "交付周期缩短40%"]'),
('中信重工', '601608', '重工业ERP系统', '重工业', '大型企业', '["项目管理效率提升50%", "成本控制精度提升35%", "客户满意度提升20%"]'),
('华润水泥', '001313', '水泥行业数字化转型', '建材', '大型企业', '["生产自动化程度提升60%", "能耗降低15%", "产品质量稳定性提升30%"]'); 