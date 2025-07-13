import { readFileSync } from 'fs';
import { join } from 'path';
import db from '../config/sqlite.js';

const runMigration = () => {
  try {
    console.log('🚀 开始执行 SQLite 初始化脚本...');

    const migrationPath = join(process.cwd(), 'src', 'database', 'db_init.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    db.exec(migrationSQL);

    console.log('✅ SQLite 初始化完成');
  } catch (error) {
    console.error('❌ SQLite 初始化失败:', error);
    process.exit(1);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default runMigration; 