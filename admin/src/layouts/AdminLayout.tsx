import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const AdminLayout: React.FC = () => {
  // 侧边栏折叠与移动端状态
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // 记忆折叠状态
  useEffect(() => {
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    setCollapsed(saved === '1');
  }, []);

  // 路由守卫：未登录自动跳转登录页
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* 侧边栏 */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      {/* 主内容区 */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${collapsed ? 'md:ml-16' : 'md:ml-56'} ml-0`}> 
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 