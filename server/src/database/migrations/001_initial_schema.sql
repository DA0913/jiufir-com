-- 久火ERP数据库初始化脚本
-- 从Supabase迁移到PostgreSQL

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建表单提交表
CREATE TABLE form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company_types JSONB NOT NULL,
    source_url TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'invalid')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建新闻文章表
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    publish_time TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT,
    summary TEXT,
    content TEXT,
    views INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建客户案例表
CREATE TABLE customer_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    company_logo TEXT NOT NULL,
    industry VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    results TEXT NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建案例配置表
CREATE TABLE case_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    company_name VARCHAR(255) NOT NULL,
    company_logo TEXT NOT NULL,
    stock_code VARCHAR(50),
    image_url TEXT,
    link_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_publish_time ON news_articles(publish_time);
CREATE INDEX idx_news_articles_is_featured ON news_articles(is_featured);
CREATE INDEX idx_customer_cases_status ON customer_cases(status);
CREATE INDEX idx_customer_cases_sort_order ON customer_cases(sort_order);
CREATE INDEX idx_case_configurations_is_active ON case_configurations(is_active);
CREATE INDEX idx_case_configurations_sort_order ON case_configurations(sort_order);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_cases_updated_at BEFORE UPDATE ON customer_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_configurations_updated_at BEFORE UPDATE ON case_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入默认管理员用户 (密码: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@erp.com', '$2a$10$rQZ8K9mN2pL3vX7yJ1hF4eR6tY8uI0oP1qA2sB3cD4eF5gH6iJ7kL8mN9oP0', 'admin');

-- 插入示例新闻数据
INSERT INTO news_articles (title, category, publish_time, summary, content, is_featured) VALUES 
('ERP系统升级公告', '系统公告', CURRENT_TIMESTAMP, '我们即将推出全新的ERP系统升级版本', '详细内容...', true),
('行业趋势分析', '行业资讯', CURRENT_TIMESTAMP, '2024年制造业发展趋势分析', '详细内容...', false);

-- 插入示例客户案例
INSERT INTO customer_cases (company_name, company_logo, industry, description, results, metrics, is_featured, sort_order) VALUES 
('示例公司A', '/images/logo-a.png', '制造业', '通过ERP系统实现了生产效率提升30%', '生产效率显著提升，成本降低20%', '{"efficiency": 30, "cost_reduction": 20}', true, 1),
('示例公司B', '/images/logo-b.png', '贸易业', 'ERP系统帮助优化了供应链管理', '库存周转率提升50%，订单处理时间缩短40%', '{"inventory_turnover": 50, "order_processing": 40}', true, 2); 