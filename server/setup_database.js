#!/usr/bin/env node
/*
  初始化 PostgreSQL 数据库（建表 + 示例数据 + 管理员账号）
  使用 server/.env 中的连接参数
*/
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'jiufire',
  DB_USER = 'zhaowenjie',
  DB_PASSWORD = ''
} = process.env;

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
});

(async () => {
  console.log('🗄️  开始初始化数据库...');
  const client = await pool.connect();
  try {
    // 读取迁移 SQL
    const migrationPath = path.join(__dirname, 'src', 'database', 'migrations', '001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄  执行迁移脚本...');
    await client.query(migrationSQL);
    console.log('✅  表结构创建完成');

    // 创建 / 更新管理员用户
    const adminUser = 'admin';
    const adminEmail = 'admin@erp.com';
    const passwordHash = await bcrypt.hash('admin123', 10);

    await client.query(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (username) DO UPDATE SET
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        role = 'admin';
    `, [adminUser, adminEmail, passwordHash]);
    console.log('🛡️  管理员账号已就绪 (admin / admin123)');

    // 插入示例新闻
    await client.query(`
      INSERT INTO news_articles (title, summary, content, author, status, published_at, is_top)
      VALUES ('欢迎使用久火 ERP', '这是第一条示例新闻', '内容...', '管理员', 'published', NOW(), true)
      ON CONFLICT DO NOTHING;
    `);

    // 插入示例表单
    await client.query(`
      INSERT INTO form_submissions (company_name, user_name, phone, company_types, source_url, status)
      VALUES ('示例公司', '张三', '13800138000', '[]'::jsonb, 'http://localhost', 'pending')
      ON CONFLICT DO NOTHING;
    `);

    console.log('🎉  数据库设置完成！');
  } catch (err) {
    console.error('❌  初始化失败:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
})();