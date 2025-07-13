import { readFileSync } from 'fs';
import { join } from 'path';
import { query, testConnection } from '../config/database.js';

const runMigration = async () => {
  try {
    console.log('🚀 开始数据库迁移...');
    
    // 测试数据库连接
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ 数据库连接失败，请检查配置');
      process.exit(1);
    }

    // 读取迁移文件
    const migrationPath = join(process.cwd(), 'src', 'database', 'migrations', '001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 执行迁移脚本...');
    
    // 执行SQL语句
    await query(migrationSQL);
    
    console.log('✅ 数据库迁移完成！');
    console.log('📊 已创建以下表:');
    console.log('   - users (用户表)');
    console.log('   - form_submissions (表单提交表)');
    console.log('   - news_articles (新闻文章表)');
    console.log('   - customer_cases (客户案例表)');
    console.log('   - case_configurations (案例配置表)');
    console.log('🔑 默认管理员账户: admin / admin123');
    
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  }
};

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default runMigration; 