# SQLite 数据库迁移总结

## 迁移概述

项目已成功从 **PostgreSQL** 迁移到 **SQLite**，使用 `better-sqlite3` 作为数据库驱动。

## 迁移内容

### 1. 依赖变更

**移除的依赖:**
- `pg` - PostgreSQL 客户端
- `@types/pg` - PostgreSQL 类型定义

**新增的依赖:**
- `better-sqlite3` - SQLite 数据库驱动
- `@types/better-sqlite3` - SQLite 类型定义

### 2. 数据库配置

**文件:** `server/src/config/database.ts`
- 从连接池模式改为直接数据库连接
- 异步操作改为同步操作
- 数据库文件位置: `./data/app.db`
- 添加了 WAL 模式和性能优化配置

### 3. 数据库架构转换

**表结构变更:**
- `UUID` → `INTEGER PRIMARY KEY AUTOINCREMENT`
- `BOOLEAN` → `INTEGER` (0/1)
- `JSONB` → `TEXT` (JSON 字符串)
- `TIMESTAMP WITH TIME ZONE` → `DATETIME`
- `VARCHAR` → `TEXT`

**主要表:**
- `users` - 用户表
- `form_submissions` - 表单提交表  
- `news_articles` - 新闻文章表
- `customer_cases` - 客户案例表
- `case_configurations` - 案例配置表

### 4. 服务层改造

**表单服务 (`FormService`):**
```javascript
// 之前 (PostgreSQL)
const result = await query('SELECT * FROM table WHERE id = $1', [id]);

// 现在 (SQLite)  
const result = queryOne('SELECT * FROM table WHERE id = ?', [id]);
```

**新闻服务 (`NewsService`):**
- 所有异步操作改为同步
- 参数占位符从 `$1, $2` 改为 `?, ?`
- 布尔值使用 `1/0` 而不是 `true/false`

### 5. 路由层改造

**主要变更:**
- 移除所有 `async/await`
- 直接调用服务方法
- 统一错误处理格式

### 6. 数据库迁移

**迁移文件:** `server/src/database/migrate.ts`
- 手动定义所有 SQL 语句
- 创建表、触发器、索引
- 插入默认数据和测试数据

## 核心特性

### 1. 同步数据库操作
```javascript
// 查询多行
const result = query('SELECT * FROM table', []);

// 查询单行  
const result = queryOne('SELECT * FROM table WHERE id = ?', [id]);

// 执行插入/更新/删除
const result = execute('INSERT INTO table VALUES (?, ?)', [val1, val2]);
```

### 2. 自动时间戳更新
使用 SQLite 触发器自动更新 `updated_at` 字段：
```sql
CREATE TRIGGER table_updated_at
  AFTER UPDATE ON table
  FOR EACH ROW
  BEGIN
    UPDATE table SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
```

### 3. UUID 生成
使用 SQLite 函数生成 UUID 格式：
```sql
uuid TEXT UNIQUE NOT NULL DEFAULT (
  lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || 
        hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || 
        hex(randomblob(6)))
)
```

### 4. 性能优化
- WAL 模式启用
- 内存缓存设置
- 索引优化
- 内存映射配置

## 环境配置

### 环境变量 (`server/env.example`)
```env
# 服务器配置
PORT=3001
NODE_ENV=development

# SQLite 数据库配置  
# 数据库文件将自动创建在 ./data/app.db
# 无需额外配置

# JWT配置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=http://localhost:5173
```

## 启动步骤

### 1. 安装依赖
```bash
cd server
npm install
```

### 2. 运行数据库迁移
```bash
npm run migrate
```

### 3. 启动服务器
```bash
npm run dev
```

## 测试数据

迁移脚本自动创建：
- **管理员用户**: admin / admin123
- **测试新闻**: 3 篇示例新闻文章
- **客户案例**: 泰山石膏、中信重工、华润水泥

## API 端点

所有原有的 API 端点保持不变：
- `POST /api/forms/submit` - 表单提交
- `GET /api/forms` - 获取表单列表
- `GET /api/news` - 获取新闻列表
- `GET /api/news/featured` - 获取精选新闻

## 优势

### 1. 部署简化
- 无需外部数据库服务
- 单文件数据库，便于备份
- 零配置启动

### 2. 性能提升
- 同步操作减少延迟
- 本地文件访问速度快
- 无网络连接开销

### 3. 开发便利
- 便于测试和调试
- 数据库文件可直接查看
- 简化的错误处理

### 4. 成本控制
- 无数据库服务费用
- 减少运维复杂度
- 资源占用更少

## 注意事项

1. **并发限制**: SQLite 写入并发有限制，适合中小型应用
2. **数据备份**: 定期备份 `./data/app.db` 文件
3. **文件权限**: 确保数据目录有正确的读写权限
4. **数据类型**: 注意 SQLite 的动态类型系统

## 故障排除

### 常见问题

1. **数据库锁定**: 确保只有一个进程访问数据库
2. **权限错误**: 检查 `./data/` 目录权限
3. **类型转换**: 注意布尔值和 JSON 数据的处理

### 检查命令
```bash
# 检查数据库文件
ls -la ./data/app.db

# 测试数据库连接
npm run migrate

# 查看服务器日志
npm run dev
```

## 总结

SQLite 迁移成功完成，系统现在具有：
- ✅ 完整的数据库功能
- ✅ 统一的 API 接口  
- ✅ 自动数据初始化
- ✅ 性能优化配置
- ✅ 简化的部署流程

项目已完全脱离对外部数据库服务的依赖，可以独立运行和部署。