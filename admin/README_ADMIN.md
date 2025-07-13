# 久火ERP管理后台

## 项目概述

这是一个基于 React 18 + TypeScript + Vite + Ant Design 的现代化管理后台系统，用于管理久火ERP网站的各项内容。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design 5.x
- **样式**: Tailwind CSS
- **图表**: Recharts
- **路由**: React Router 6
- **HTTP客户端**: Axios
- **日期处理**: Day.js

## 功能特性

### 1. 用户认证
- 登录/登出功能
- "记住我"功能（7天有效期）
- 路由级权限控制
- Token自动注入和401跳转

### 2. 响应式布局
- 桌面端：侧边栏常驻，内容区自适应
- 平板端：侧边栏可折叠为仅显示图标
- 移动端：侧边栏默认隐藏，通过汉堡按钮唤起
- 侧边栏折叠状态记忆（localStorage）

### 3. 仪表盘
- 数据统计卡片（表单、新闻、案例、智库数量）
- 趋势图表（支持日/周/月切换）
- 快捷操作按钮
- 点击卡片跳转对应管理页面

### 4. 表单管理
- 表单列表展示（提交时间、表单名称、提交人、状态）
- 状态管理（未处理/已回复）
- 详情查看弹窗
- 筛选功能（状态、时间范围、关键词搜索）
- 批量操作（删除、状态更新）
- 数据导出（Excel）

### 5. 新闻管理
- 新闻列表（封面图、标题、作者、状态、置顶、发布时间）
- 新增/编辑弹窗
- 富文本编辑器（支持Markdown、图片上传）
- 图片上传组件（拖拽上传、预览、删除）
- 批量操作（发布、设为草稿、删除）
- 数据导出

### 6. 全局搜索
- 顶部搜索框
- 跨模块搜索（新闻、案例、表单、智库）
- 搜索结果下拉展示
- 点击结果跳转详情页

## 项目结构

```
admin/
├── src/
│   ├── api/                 # API接口封装
│   │   ├── request.ts       # 请求拦截器
│   │   ├── authApi.ts       # 认证相关API
│   │   ├── formApi.ts       # 表单管理API
│   │   ├── newsApi.ts       # 新闻管理API
│   │   ├── caseApi.ts       # 案例管理API
│   │   ├── uploadApi.ts     # 文件上传API
│   │   └── dashboardApi.ts  # 仪表盘API
│   ├── components/          # 通用组件
│   │   ├── Sidebar.tsx      # 侧边栏
│   │   ├── Topbar.tsx       # 顶部导航
│   │   ├── ImageUpload.tsx  # 图片上传组件
│   │   ├── RichTextEditor.tsx # 富文本编辑器
│   │   └── GlobalSearch.tsx # 全局搜索
│   ├── layouts/             # 布局组件
│   │   └── AdminLayout.tsx  # 主布局
│   ├── pages/               # 页面组件
│   │   ├── Login.tsx        # 登录页
│   │   ├── Dashboard.tsx    # 仪表盘
│   │   ├── Forms.tsx        # 表单管理
│   │   └── News.tsx         # 新闻管理
│   ├── hooks/               # 自定义Hooks
│   ├── utils/               # 工具函数
│   └── App.tsx              # 主应用
```

## 安装和运行

### 1. 安装依赖
```bash
cd admin
npm install
```

### 2. 环境配置
创建 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173

### 4. 构建生产版本
```bash
npm run build
```

## API接口规范

### 认证相关
- `POST /auth/login` - 用户登录
- `POST /auth/logout` - 用户登出
- `GET /auth/me` - 获取当前用户信息

### 表单管理
- `GET /forms` - 获取表单列表
- `GET /forms/:id` - 获取表单详情
- `PATCH /forms/:id/status` - 更新表单状态
- `DELETE /forms/:id` - 删除表单
- `POST /forms/batch-delete` - 批量删除
- `GET /forms/export` - 导出表单数据

### 新闻管理
- `GET /news` - 获取新闻列表
- `GET /news/:id` - 获取新闻详情
- `POST /news` - 创建新闻
- `PUT /news/:id` - 更新新闻
- `DELETE /news/:id` - 删除新闻
- `POST /news/batch-delete` - 批量删除
- `POST /news/batch-update-status` - 批量更新状态
- `GET /news/export` - 导出新闻数据

### 文件上传
- `POST /upload/image` - 上传图片
- `POST /upload/file` - 上传文件
- `DELETE /upload/file/:filename` - 删除文件

### 仪表盘
- `GET /dashboard` - 获取仪表盘数据
- `GET /dashboard/stats` - 获取统计数据
- `GET /dashboard/trends` - 获取趋势数据

## 开发规范

### 1. 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

### 2. 组件开发
- 函数式组件 + Hooks
- Props 类型定义
- 错误边界处理

### 3. API 调用
- 统一使用 request.ts 封装的 axios 实例
- 自动处理 token 注入和错误处理
- 使用 TypeScript 类型定义

### 4. 状态管理
- 使用 React Hooks 管理本地状态
- 复杂状态考虑使用 Context 或状态管理库

## 部署说明

### 1. 开发环境
```bash
npm run dev
```

### 2. 生产环境
```bash
npm run build
npm run preview
```

### 3. Nginx 配置示例
```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    
    location / {
        root /path/to/admin/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 注意事项

1. **后端依赖**: 需要先启动后端服务（端口3001）
2. **数据库**: 确保PostgreSQL数据库已正确配置
3. **文件上传**: 确保上传目录有写入权限
4. **跨域**: 开发环境需要配置CORS
5. **权限**: 生产环境需要配置适当的权限控制

## 后续开发计划

1. **客户案例管理页面** - 支持案例的增删改查、图片上传、行业分类
2. **外贸智库管理页面** - 支持智库文章的富文本编辑、分类管理
3. **用户管理** - 管理员账户管理、角色权限控制
4. **系统设置** - 网站配置、操作日志查看
5. **数据统计** - 更详细的统计报表和图表
6. **消息通知** - 系统消息、邮件通知功能

## 联系方式

如有问题或建议，请联系开发团队。 

---

## 1. 点击首页图标没有跳转后台

**排查：**
- 你首页图标的 `onClick` 事件应该是 `window.open('http://localhost:5173/login', '_blank')`。
- 如果点击没反应，可能是：
  - 浏览器拦截了弹窗（请检查浏览器地址栏右侧是否有“弹窗被拦截”提示）。
  - 代码没有正确绑定 `onClick`。
  - 你访问的不是本地 5173 端口，或者端口没开。

**建议：**
- 先手动在浏览器输入 `http://localhost:5173/login`，看能否访问后台登录页。
- 检查浏览器弹窗拦截设置。
- 检查前端代码是否如下（以 React 为例）：

  ```jsx
  <button onClick={() => window.open('http://localhost:5173/login', '_blank')}>
    <ShieldIcon />
  </button>
  ```

---

## 2. 用网页登录显示 `{"success":false,"message":"接口不存在"}`

**这说明：**
- 你访问的后端接口路径不对，或者后端没有注册 `/api/auth/login` 路由。

**解决办法：**

### 步骤一：确认后端路由注册

1. **你必须有如下代码：**

   - `server/src/routes/auth.ts` 文件内容如下：

     ```typescript
     import { Router } from 'express';
     const router = Router();

     router.post('/login', (req, res) => {
       // 简单示例
       if (req.body.username === 'admin' && req.body.password === 'admin') {
         return res.json({
           success: true,
           token: 'mock-token',
           user: { id: 1, username: 'admin', role: 'admin' }
         });
       }
       return res.status(401).json({ success: false, message: '用户名或密码错误' });
     });

     export default router;
     ```

   - 在 `server/src/index.ts` 里注册：

     ```typescript
     import authRouter from './routes/auth';
     app.use('/api/auth', authRouter);
     ```

2. **重启后端服务！**

   ```bash
   npm run dev
   ```

### 步骤二：本地测试接口

- 用 Postman 或 curl 测试：

  ```bash
  curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin"}'
  ```

  应该返回：

  ```json
  {
    "success": true,
    "token": "mock-token",
    "user": { "id": 1, "username": "admin", "role": "admin" }
  }
  ```

- 如果还是 `接口不存在`，说明路由没注册对，或者路径拼错。

---

## 总结

1. **首页图标跳转问题**：检查代码和浏览器弹窗拦截。
2. **接口不存在问题**：后端必须有 `/api/auth/login` 路由，并且注册到 `/api/auth`，重启服务后再试。

---

### 如果你不确定怎么操作，请把你 `server/src/index.ts` 和 `server/src/routes/auth.ts` 的内容贴出来，我帮你直接改！ 

---

## 你需要怎么做？

### 1. **创建/完善 `server/src/routes/auth.ts`**

请新建或编辑 `server/src/routes/auth.ts`，内容如下：

```typescript
import { Router } from 'express';
const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.json({
      success: true,
      token: 'mock-token',
      user: { id: 1, username: 'admin', role: 'admin' }
    });
  }
  return res.status(401).json({ success: false, message: '用户名或密码错误' });
});

export default router;
```

---

### 2. **在 `server/src/index.ts` 注册路由**

确保你的 `server/src/index.ts` 里有如下内容：

```typescript
import express from 'express';
import authRouter from './routes/auth';
// ... 其他import

const app = express();
app.use(express.json()); // 解析json

// ... 其他app.use

app.use('/api/auth', authRouter);

// ... 其他代码
```

---

### 3. **重启后端服务**

每次改完代码都要重启后端服务：

```bash
npm run dev
```

---

### 4. **本地测试接口**

用 Postman 或 curl 测试：

```bash
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin"}'
```

应该返回：

```json
{
  "success": true,
  "token": "mock-token",
  "user": { "id": 1, "username": "admin", "role": "admin" }
}
```

---

## 只要你完成上面两步，前端就能正常登录了！

---

### 如果你不会操作，请把你 `server/src/index.ts` 和 `server/src/routes/auth.ts` 的内容粘贴出来，我帮你直接改！ 