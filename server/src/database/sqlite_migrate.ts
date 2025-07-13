import { readFileSync } from 'fs';
import { join } from 'path';
import db from '../config/sqlite.js';

const runSQLiteMigration = async () => {
  try {
    console.log('🚀 开始 SQLite 数据库迁移...');
    
    // 读取迁移文件
    const migrationPath = join(process.cwd(), 'src', 'database', 'init_sqlite.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 执行 SQLite 迁移脚本...');
    
    // 分割 SQL 语句并执行
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        db.exec(statement);
      }
    }
    
    console.log('✅ SQLite 数据库迁移完成！');
    console.log('📊 已创建以下表:');
    console.log('   - users (用户表)');
    console.log('   - form_submissions (表单提交表)');
    console.log('   - news_articles (新闻文章表)');
    console.log('   - customer_cases (客户案例表)');
    console.log('   - case_configurations (案例配置表)');
    console.log('🔑 默认管理员账户: admin / admin123');
    console.log(`📁 数据库文件位置: ./data/app.db`);
    
  } catch (error) {
    console.error('❌ SQLite 迁移失败:', error);
    process.exit(1);
  }
};

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runSQLiteMigration();
}

export default runSQLiteMigration;