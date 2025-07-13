# 数据库迁移：从 PostgreSQL 到 SQLite

## 迁移概述

本项目已成功从 PostgreSQL 迁移到 SQLite，使用 `better-sqlite3` 作为数据库驱动。迁移包括以下主要变更：

## 主要变更

### 1. 数据库配置
- **新增文件**: `server/src/config/sqlite.ts`
- **替换**: PostgreSQL 连接池 → SQLite 单文件数据库
- **数据库位置**: `./data/app.db`

### 2. 数据库初始化
- **新增文件**: `server/src/database/init_sqlite.sql`
- **新增文件**: `server/src/database/sqlite_migrate.ts`
- **变更**: UUID 主键 → INTEGER 自增主键
- **变更**: PostgreSQL 数据类型 → SQLite 兼容类型

### 3. 服务层更新
- **更新文件**: `server/src/services/formService.ts`
- **更新文件**: `server/src/services/newsService.ts`
- **新增文件**: `server/src/services/authService.ts`
- **变更**: 异步查询 → 同步查询
- **变更**: 参数占位符 `$1, $2` → `?, ?`

### 4. 认证系统升级
- **新增文件**: `server/src/middleware/auth.ts`
- **更新文件**: `server/src/routes/auth.ts`
- **变更**: Mock 认证 → JWT 认证
- **新增**: 密码加密 (bcrypt)

### 5. 类型定义更新
- **更新文件**: `server/src/types/index.ts`
- **变更**: ID 类型 `string` → `number`
- **变更**: 时间类型 `Date` → `string`
- **变更**: 布尔值 `boolean` → `number` (0/1)

## 数据库结构变更

### 主要表结构

```sql
-- 用户表
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 表单提交表
CREATE TABLE form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    user_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_types TEXT NOT NULL, -- JSON 字符串
    source_url TEXT NOT NULL,
    submitted_at TEXT DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 新闻文章表
CREATE TABLE news_articles (
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
```

## 需要安装的依赖

```bash
# 安装 SQLite 相关依赖
npm install better-sqlite3
npm install @types/better-sqlite3 --save-dev

# 安装 JWT 和密码加密依赖
npm install jsonwebtoken bcryptjs
npm install @types/jsonwebtoken @types/bcryptjs --save-dev
```

## 启动步骤

1. 安装依赖：
```bash
cd server
npm install better-sqlite3 @types/better-sqlite3 jsonwebtoken bcryptjs @types/jsonwebtoken @types/bcryptjs
```

2. 设置环境变量（可选）：
```bash
# .env 文件
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

3. 启动服务器：
```bash
npm run dev
```

服务器启动时会自动：
- 创建 `./data/` 目录
- 初始化 SQLite 数据库
- 创建所有必要的表
- 插入默认管理员用户

## 默认用户

- **用户名**: admin
- **密码**: admin123
- **角色**: admin

## API 变更

### 认证相关
- `POST /api/auth/login` - 用户登录（返回 JWT token）
- `POST /api/auth/verify` - 验证 token
- `GET /api/auth/me` - 获取当前用户信息

### 数据查询
- 所有 API 响应中的 ID 字段现在是数字类型
- 布尔值字段在数据库中存储为 0/1，但 API 层会进行适当转换
- 时间字段以 ISO 字符串格式返回

## 迁移优势

1. **简化部署**: 无需外部数据库服务器
2. **提高性能**: 同步查询，减少异步开销
3. **增强安全**: JWT 认证替代简单 mock
4. **便于开发**: 单文件数据库，易于备份和迁移
5. **降低成本**: 无需 PostgreSQL 服务器维护

## 注意事项

1. SQLite 适合中小型应用，大型应用建议使用 PostgreSQL
2. 并发写入性能相对较低
3. 不支持复杂的用户权限和角色管理
4. 建议定期备份 `./data/app.db` 文件

## 完成状态

✅ 数据库配置迁移  
✅ 表结构转换  
✅ 服务层更新  
✅ 认证系统升级  
✅ 类型定义更新  
✅ 路由适配  
⚠️ 需要安装新依赖  
⚠️ 需要更新前端调用（如果有布尔值处理）