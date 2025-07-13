# 久火ERP - 完整表单管理系统

这是一个完整的网站系统，使用MySQL数据库存储数据。

## 功能特性

### 前端功能
- 🎯 **智能表单按钮** - 点击后弹出表单
- 📝 **美观表单模态框** - 响应式设计，支持移动端
- ✅ **完整表单验证** - 实时验证，友好错误提示
- 🔒 **数据安全** - 表单验证和安全提交
- 📱 **移动端优化** - 完美适配各种设备

### 数据库设计
- 🗄️ **MySQL数据库** - 稳定可靠的数据存储
- 🔒 **数据安全** - 安全的数据传输和存储
- ⚡ **性能优化** - 合理索引设计
- 🔄 **RESTful API** - 标准化的数据接口

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS
- **数据库**: MySQL
- **后端**: 需要配置支持MySQL的后端服务
- **路由**: React Router DOM
- **图标**: Lucide React
- **状态管理**: React Hooks

## 快速开始

### 1. 环境配置

```bash
# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env
```

### 2. 数据库设置

1. 设置MySQL数据库
2. 配置后端API服务
3. 更新 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. 后端服务

您需要创建一个支持以下API端点的后端服务：
- `POST /api/forms/submit` - 表单提交
- `GET /api/news` - 获取新闻文章
- `GET /api/cases` - 获取客户案例

### 4. 启动项目
```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build
```

### 表单字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| company_name | string | ✅ | 公司名称 |
| user_name | string | ✅ | 用户姓名 |
| phone | string | ✅ | 联系电话（手机号验证） |
| company_types | array | ✅ | 公司类型（工厂/贸易商/工贸一体） |
| source_url | string | 自动 | 来源页面URL |
| status | enum | 自动 | 处理状态 |


## 部署说明

### 1. 构建项目
```bash
npm run build
```

### 2. 部署前端
可以部署到 Netlify、Vercel、GitHub Pages 等静态托管平台。

### 3. 部署后端
需要部署支持MySQL的后端服务，并配置相应的API端点。

### 4. 环境变量配置
在部署平台配置相同的环境变量。

## MySQL数据库表结构

### form_submissions 表
```sql
CREATE TABLE form_submissions (
  id VARCHAR(36) PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company_types JSON NOT NULL,
  source_url TEXT NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'invalid') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### news_articles 表
```sql
CREATE TABLE news_articles (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  publish_time TIMESTAMP NOT NULL,
  image_url TEXT,
  summary TEXT,
  content LONGTEXT,
  views INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 扩展功能

### 后端API开发
建议使用 Node.js + Express 或其他后端框架来实现API服务。

## 故障排除

### 常见问题

1. **表单提交失败**
   - 检查后端API服务是否正常运行
   - 确认API端点配置正确

2. **数据不显示**
   - 检查MySQL数据库连接
   - 确认API返回正确的数据格式

### 调试模式

开启浏览器开发者工具，查看Network面板检查API请求状态。

## 技术支持

如有问题，请检查：
1. MySQL数据库连接状态
2. 后端API服务状态
2. 环境变量配置
3. API端点配置

## 许可证

MIT License