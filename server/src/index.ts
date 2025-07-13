import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import db from './config/sqlite.js';

// 路由导入
import formsRouter from './routes/forms.js';
import newsRouter from './routes/news.js';
import authRouter from './routes/auth';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,
  credentials: true
}));

// 请求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试'
  }
});
app.use('/api/', limiter);

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '服务器运行正常',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API路由
app.use('/api/auth', authRouter);
app.use('/api/forms', formsRouter);
app.use('/api/news', newsRouter);

app.get('/api/dashboard', (req, res) => {
  res.json({
    stats: {
      totalForms: 100,
      totalNews: 50,
      totalCases: 20,
      totalKnowledge: 10,
      pendingForms: 5,
      publishedNews: 40,
      activeCases: 15
    },
    trends: [
      { date: '01-01', forms: 5, news: 3, cases: 2 },
      { date: '01-02', forms: 8, news: 4, cases: 1 },
      { date: '01-03', forms: 6, news: 5, cases: 3 }
    ]
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 全局错误处理
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', error);
  
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : '未知错误'
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // SQLite 初始化检查
    console.log('🔌 SQLite 数据库路径:', db.name);

    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log('🚀 服务器启动成功！');
      console.log(`📍 服务地址: http://localhost:${PORT}`);
      console.log(`🔗 API文档: http://localhost:${PORT}/health`);
      console.log(`📊 环境: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});

// 启动服务器
startServer(); 