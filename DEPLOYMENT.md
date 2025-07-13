# 久火ERP系统部署指南

## 项目概述

本项目已完成从纯前端架构到前后端分离架构的改造，并迁移数据库从Supabase到PostgreSQL。

### 技术栈
- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: Node.js + Express + TypeScript + PostgreSQL
- **数据库**: PostgreSQL (替代Supabase)

## 目录结构

```
project/
├── src/                    # 前端代码
│   ├── components/         # React组件
│   ├── lib/
│   │   ├── api.ts         # 新的API客户端（替换supabase.ts）
│   │   └── supabase.ts    # 旧文件（已废弃）
│   └── ...
├── server/                 # 后端代码
│   ├── src/
│   │   ├── config/        # 数据库配置
│   │   ├── database/      # 数据库迁移脚本
│   │   ├── routes/        # API路由
│   │   ├── services/      # 业务逻辑服务
│   │   ├── types/         # TypeScript类型定义
│   │   └── index.ts       # 服务器入口
│   ├── package.json       # 后端依赖
│   ├── tsconfig.json      # TypeScript配置
│   └── env.example        # 环境变量示例
└── ...
```

## 部署步骤

### 1. 环境准备

#### 1.1 安装Node.js
确保安装了Node.js 18+版本：
```bash
node --version
npm --version
```

#### 1.2 安装PostgreSQL
- **macOS**: `brew install postgresql`
- **Ubuntu**: `sudo apt-get install postgresql postgresql-contrib`
- **Windows**: 下载并安装PostgreSQL官方安装包

#### 1.3 创建数据库
```bash
# 登录PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE erp_database;

# 退出
\q
```

### 2. 后端部署

#### 2.1 安装后端依赖
```bash
cd server
npm install
```

#### 2.2 配置环境变量
```bash
# 复制环境变量文件
cp env.example .env

# 编辑.env文件
nano .env
```

配置内容：
```env
# 服务器配置
PORT=3001
NODE_ENV=production

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=erp_database
DB_USER=postgres
DB_PASSWORD=your_password

# JWT配置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=http://localhost:5173

# 文件上传配置
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

#### 2.3 运行数据库迁移
```bash
# 执行数据库迁移
npm run migrate
```

#### 2.4 启动后端服务
```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

### 3. 前端部署

#### 3.1 配置API地址
在项目根目录创建`.env`文件：
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

#### 3.2 安装前端依赖
```bash
# 回到项目根目录
cd ..
npm install
```

#### 3.3 启动前端服务
```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build
```

### 4. 生产环境部署

#### 4.1 使用PM2部署后端
```bash
# 安装PM2
npm install -g pm2

# 进入后端目录
cd server

# 构建项目
npm run build

# 使用PM2启动
pm2 start dist/index.js --name "erp-backend"

# 设置开机自启
pm2 startup
pm2 save
```

#### 4.2 使用Nginx部署前端
```bash
# 构建前端
npm run build

# 配置Nginx
sudo nano /etc/nginx/sites-available/erp-frontend
```

Nginx配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/project/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/erp-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 数据库迁移说明

### 从Supabase迁移到PostgreSQL

#### 1. 导出Supabase数据
```bash
# 使用pg_dump导出数据
pg_dump "postgresql://postgres:[password]@[host]:5432/[database]" > supabase_backup.sql
```

#### 2. 导入到PostgreSQL
```bash
# 导入数据到新的PostgreSQL数据库
psql -U postgres -d erp_database -f supabase_backup.sql
```

#### 3. 数据格式转换
由于Supabase和PostgreSQL的某些数据类型可能不同，需要手动调整：

- JSON字段：确保使用`JSONB`类型
- UUID字段：使用`uuid-ossp`扩展
- 时间戳：使用`TIMESTAMP WITH TIME ZONE`

## API接口文档

### 表单相关接口

#### 提交表单
```
POST /api/forms/submit
Content-Type: application/json

{
  "company_name": "公司名称",
  "user_name": "用户姓名",
  "phone": "13800138000",
  "company_types": ["factory", "trader"],
  "source_url": "http://example.com"
}
```

#### 获取表单列表
```
GET /api/forms?page=1&limit=10
```

#### 更新表单状态
```
PATCH /api/forms/:id
Content-Type: application/json

{
  "status": "processing",
  "notes": "处理备注"
}
```

### 新闻相关接口

#### 获取新闻列表
```
GET /api/news?page=1&limit=10
```

#### 获取精选新闻
```
GET /api/news/featured?limit=5
```

#### 获取新闻详情
```
GET /api/news/:id
```

## 故障排除

### 常见问题

#### 1. 数据库连接失败
- 检查PostgreSQL服务是否启动
- 验证数据库连接参数
- 确认防火墙设置

#### 2. 前端无法连接后端
- 检查CORS配置
- 验证API地址配置
- 确认后端服务是否正常运行

#### 3. 数据迁移失败
- 检查SQL语法兼容性
- 验证数据类型转换
- 确认数据库权限

### 日志查看

#### 后端日志
```bash
# PM2日志
pm2 logs erp-backend

# 直接查看日志文件
tail -f ~/.pm2/logs/erp-backend-out.log
tail -f ~/.pm2/logs/erp-backend-error.log
```

#### 前端日志
在浏览器开发者工具中查看Console和Network面板。

## 性能优化

### 数据库优化
- 创建适当的索引
- 优化查询语句
- 配置连接池

### 前端优化
- 启用代码分割
- 压缩静态资源
- 使用CDN加速

### 后端优化
- 启用压缩
- 配置缓存
- 优化API响应

## 安全配置

### 环境变量
- 使用强密码
- 定期更换密钥
- 限制访问权限

### 网络安全
- 配置HTTPS
- 设置防火墙
- 启用WAF

### 数据库安全
- 限制网络访问
- 定期备份
- 监控异常访问

## 监控和维护

### 健康检查
```bash
# 检查后端健康状态
curl http://localhost:3001/health

# 检查数据库连接
npm run migrate
```

### 定期维护
- 数据库备份
- 日志清理
- 依赖更新
- 安全补丁

## 联系支持

如遇到问题，请检查：
1. 环境配置是否正确
2. 依赖是否完整安装
3. 服务是否正常启动
4. 网络连接是否正常

更多技术支持请参考项目文档或联系开发团队。 