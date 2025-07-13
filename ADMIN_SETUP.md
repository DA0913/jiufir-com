# 久火ERP管理后台 - 启动指南

## 🎉 问题已解决！

Tailwind CSS 配置问题已经修复，管理后台现在可以正常运行了。

## 📋 修复内容

### 1. Tailwind CSS 配置修复
- 卸载了 Tailwind CSS v4（不兼容）
- 安装了 Tailwind CSS v3.4.0 + PostCSS + Autoprefixer
- 更新了 `tailwind.config.js` 配置
- 修复了 `index.css` 样式文件
- 禁用了 `verbatimModuleSyntax` 以解决导入问题

### 2. 依赖安装
- 安装了 `dayjs` 日期处理库
- 确保所有必要的依赖都已正确安装

## 🚀 快速启动

### 方法一：使用启动脚本（推荐）
```bash
# 在项目根目录执行
./start_admin.sh
```

### 方法二：手动启动
```bash
# 进入管理后台目录
cd admin

# 安装依赖（如果还没安装）
npm install

# 启动开发服务器
npm run dev
```

## 🌐 访问地址

- **管理后台**: http://localhost:5173
- **测试页面**: http://localhost:5173/test
- **登录页面**: http://localhost:5173/login

## 🔧 环境配置

管理后台会自动创建 `.env` 文件，包含以下配置：
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## 📱 功能验证

访问 http://localhost:5173/test 可以查看：
- ✅ Tailwind CSS 样式是否正常
- ✅ Ant Design 组件是否正常
- ✅ 响应式布局是否正常
- ✅ 图标显示是否正常

## 🎯 主要功能

### 1. 用户认证
- 登录/登出功能
- "记住我"功能（7天有效期）
- 路由级权限控制

### 2. 响应式布局
- 桌面端：侧边栏常驻
- 平板端：侧边栏可折叠
- 移动端：侧边栏隐藏，汉堡按钮唤起

### 3. 核心页面
- **仪表盘**: 数据统计、趋势图表、快捷操作
- **表单管理**: 列表、筛选、批量操作、导出
- **新闻管理**: 富文本编辑、图片上传、状态管理

### 4. 通用组件
- **图片上传**: 拖拽上传、预览、删除
- **富文本编辑器**: Markdown支持、图片插入
- **全局搜索**: 跨模块搜索功能

## 🔍 技术栈

- **前端**: React 18 + TypeScript + Vite
- **UI库**: Ant Design 5.x + Tailwind CSS
- **图表**: Recharts
- **路由**: React Router 6
- **HTTP**: Axios
- **日期**: Day.js

## 📁 项目结构

```
admin/
├── src/
│   ├── api/                 # API接口封装
│   ├── components/          # 通用组件
│   ├── layouts/             # 布局组件
│   ├── pages/               # 页面组件
│   └── App.tsx              # 主应用
├── .env                     # 环境变量
├── tailwind.config.js       # Tailwind配置
├── postcss.config.js        # PostCSS配置
└── package.json             # 依赖配置
```

## 🛠️ 开发说明

### 1. 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式 + Hooks

### 2. 样式规范
- 优先使用 Tailwind CSS 类名
- 复杂样式使用 CSS 模块
- 与 Ant Design 组件兼容

### 3. API 调用
- 统一使用 `request.ts` 封装的 axios
- 自动处理 token 注入和错误处理
- 完整的 TypeScript 类型定义

## 🔧 故障排除

### 1. 如果遇到 Tailwind CSS 错误
```bash
cd admin
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
npx tailwindcss init -p
```

### 2. 如果遇到 TypeScript 错误
检查 `tsconfig.app.json` 中的 `verbatimModuleSyntax` 是否设置为 `false`

### 3. 如果遇到端口占用
```bash
# 查找占用端口的进程
lsof -i :5173
# 杀死进程
kill -9 <PID>
```

## 📞 支持

如果遇到任何问题，请检查：
1. Node.js 版本是否 >= 16
2. 所有依赖是否正确安装
3. 后端服务是否正常运行（端口3001）
4. 环境变量是否正确配置

## 🎊 恭喜！

管理后台现在已经完全正常运行，你可以开始使用了！

- 访问 http://localhost:5173 查看主页面
- 访问 http://localhost:5173/test 验证功能
- 访问 http://localhost:5173/login 进行登录测试 