#!/bin/bash

echo "🚀 启动久火ERP管理后台..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装，请先安装npm"
    exit 1
fi

# 进入管理后台目录
cd admin

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 创建环境变量文件
if [ ! -f ".env" ]; then
    echo "🔧 创建环境变量文件..."
    echo "VITE_API_BASE_URL=http://localhost:3001/api" > .env
fi

# 启动开发服务器
echo "🌐 启动管理后台开发服务器..."
echo "📍 访问地址: http://localhost:5173"
echo "🔑 默认登录: admin/admin"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

npm run dev 