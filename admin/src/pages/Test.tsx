import React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Test: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Title level={1} className="text-blue-600 mb-6">
          管理后台测试页面
        </Title>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="text-center">
              <HomeOutlined className="text-4xl text-blue-500 mb-4" />
              <Title level={3}>仪表盘</Title>
              <Text type="secondary">查看数据统计和趋势</Text>
            </div>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <div className="text-center">
              <UserOutlined className="text-4xl text-green-500 mb-4" />
              <Title level={3}>用户管理</Title>
              <Text type="secondary">管理系统用户和权限</Text>
            </div>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <div className="text-center">
              <SettingOutlined className="text-4xl text-orange-500 mb-4" />
              <Title level={3}>系统设置</Title>
              <Text type="secondary">配置系统参数</Text>
            </div>
          </Card>
        </div>
        
        <Card>
          <Title level={2} className="mb-4">功能验证</Title>
          <Space direction="vertical" size="large" className="w-full">
            <div>
              <Text strong>Tailwind CSS 样式测试：</Text>
              <div className="mt-2 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                <p className="text-blue-800">这是一个使用 Tailwind CSS 样式的测试区域</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 bg-blue-500 text-white rounded text-sm">标签1</span>
                  <span className="px-2 py-1 bg-green-500 text-white rounded text-sm">标签2</span>
                  <span className="px-2 py-1 bg-orange-500 text-white rounded text-sm">标签3</span>
                </div>
              </div>
            </div>
            
            <div>
              <Text strong>Ant Design 组件测试：</Text>
              <div className="mt-2 space-x-2">
                <Button type="primary">主要按钮</Button>
                <Button>默认按钮</Button>
                <Button type="dashed">虚线按钮</Button>
                <Button danger>危险按钮</Button>
              </div>
            </div>
            
            <div>
              <Text strong>响应式布局测试：</Text>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-100 rounded text-center">列 1</div>
                <div className="p-4 bg-gray-100 rounded text-center">列 2</div>
                <div className="p-4 bg-gray-100 rounded text-center">列 3</div>
                <div className="p-4 bg-gray-100 rounded text-center">列 4</div>
              </div>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Test; 