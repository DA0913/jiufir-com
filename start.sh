#!/bin/bash

# 久火ERP系统快速启动脚本
# 用于同时启动前端和后端服务

echo "🚀 久火ERP系统启动脚本"
echo "================================"

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node_version=$(node --version)
npm_version=$(npm --version)
echo "✅ Node.js: $node_version"
echo "✅ npm: $npm_version"

# 检查PostgreSQL连接
echo "🔌 检查PostgreSQL连接..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL客户端已安装"
else
    echo "❌ PostgreSQL客户端未安装，请先安装PostgreSQL"
    exit 1
fi

# 启动后端服务
echo "🔧 启动后端服务..."
cd server

# 检查后端依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚙️ 创建环境变量文件..."
    cp env.example .env
    echo "⚠️  请编辑 server/.env 文件配置数据库连接信息"
fi

# 启动后端（后台运行）
echo "🚀 启动后端服务..."
npm run dev &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 5

# 检查后端是否启动成功
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ 后端服务启动成功 (PID: $BACKEND_PID)"
else
    echo "❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 回到根目录启动前端
cd ..

# 检查前端依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

# 检查前端环境变量
if [ ! -f ".env" ]; then
    echo "⚙️ 创建前端环境变量文件..."
    echo "VITE_API_BASE_URL=http://localhost:3001/api" > .env
fi

# 启动前端
echo "🚀 启动前端服务..."
npm run dev &
FRONTEND_PID=$!

# 等待前端启动
echo "⏳ 等待前端服务启动..."
sleep 3

echo "================================"
echo "🎉 系统启动完成！"
echo "📍 前端地址: http://localhost:5173"
echo "📍 后端地址: http://localhost:3001"
echo "🔗 API文档: http://localhost:3001/health"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 保存进程ID到文件
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# 等待用户中断
trap 'cleanup' INT

cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    
    # 停止后端
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        kill $BACKEND_PID 2>/dev/null
        rm .backend.pid
        echo "✅ 后端服务已停止"
    fi
    
    # 停止前端
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        kill $FRONTEND_PID 2>/dev/null
        rm .frontend.pid
        echo "✅ 前端服务已停止"
    fi
    
    echo "👋 再见！"
    exit 0
}

# 保持脚本运行
wait 