import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Statistic } from 'antd';
import { 
  FileTextOutlined, 
  AppstoreOutlined, 
  UserOutlined, 
  BookOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dashboardApi.getDashboard(period);
      setStats(response.stats);
      setTrends(response.trends);
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
      // 使用模拟数据
      setStats({
        totalForms: 156,
        totalNews: 89,
        totalCases: 45,
        totalKnowledge: 23,
        pendingForms: 12,
        publishedNews: 67,
        activeCases: 38
      });
      setTrends([
        { date: '01-01', forms: 5, news: 3, cases: 2 },
        { date: '01-02', forms: 8, news: 4, cases: 1 },
        { date: '01-03', forms: 6, news: 5, cases: 3 },
        { date: '01-04', forms: 9, news: 2, cases: 2 },
        { date: '01-05', forms: 7, news: 6, cases: 4 },
        { date: '01-06', forms: 4, news: 3, cases: 1 },
        { date: '01-07', forms: 10, news: 7, cases: 5 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: '表单提交',
      value: stats?.totalForms || 0,
      icon: <FileTextOutlined className="text-blue-500" />,
      color: 'blue',
      path: '/forms'
    },
    {
      title: '新闻发布',
      value: stats?.totalNews || 0,
      icon: <AppstoreOutlined className="text-green-500" />,
      color: 'green',
      path: '/news'
    },
    {
      title: '客户案例',
      value: stats?.totalCases || 0,
      icon: <UserOutlined className="text-orange-500" />,
      color: 'orange',
      path: '/cases'
    },
    {
      title: '智库文章',
      value: stats?.totalKnowledge || 0,
      icon: <BookOutlined className="text-purple-500" />,
      color: 'purple',
      path: '/knowledge'
    }
  ];

  const quickActions = [
    { label: '新增新闻', path: '/news', icon: <PlusOutlined /> },
    { label: '添加案例', path: '/cases', icon: <PlusOutlined /> },
    { label: '查看表单', path: '/forms', icon: <FileTextOutlined /> },
    { label: '管理智库', path: '/knowledge', icon: <BookOutlined /> }
  ];

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">仪表盘</h1>
        <p className="text-gray-600 mt-1">欢迎回来，这里是您的数据概览</p>
      </div>

      {/* 快捷操作区 */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">快捷操作</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              type="default"
              size="large"
              className="h-16 flex flex-col items-center justify-center"
              onClick={() => navigate(action.path)}
            >
              <div className="mb-2">{action.icon}</div>
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* 数据卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              className="cursor-pointer"
              onClick={() => navigate(card.path)}
            >
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.icon}
                valueStyle={{ color: `var(--ant-color-${card.color}-6)` }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 趋势图表 */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">数据趋势</h3>
          <div className="flex gap-2">
            {(['day', 'week', 'month'] as const).map((p) => (
              <Button
                key={p}
                type={period === p ? 'primary' : 'default'}
                size="small"
                onClick={() => setPeriod(p)}
              >
                {p === 'day' ? '日' : p === 'week' ? '周' : '月'}
              </Button>
            ))}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="forms" 
              stroke="#1890ff" 
              strokeWidth={2}
              name="表单"
            />
            <Line 
              type="monotone" 
              dataKey="news" 
              stroke="#52c41a" 
              strokeWidth={2}
              name="新闻"
            />
            <Line 
              type="monotone" 
              dataKey="cases" 
              stroke="#fa8c16" 
              strokeWidth={2}
              name="案例"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard; 