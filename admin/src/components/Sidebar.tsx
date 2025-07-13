import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  BookOutlined, 
  AppstoreOutlined, 
  MenuOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';

const menuItems = [
  { key: 'dashboard', icon: <HomeOutlined />, label: '仪表盘', path: '/dashboard' },
  { key: 'forms', icon: <FileTextOutlined />, label: '表单管理', path: '/forms' },
  { key: 'news', icon: <AppstoreOutlined />, label: '新闻管理', path: '/news' },
  { key: 'cases', icon: <UserOutlined />, label: '客户案例', path: '/cases' },
  { key: 'knowledge', icon: <BookOutlined />, label: '外贸智库', path: '/knowledge' },
];

const Sidebar: React.FC<{ collapsed: boolean; setCollapsed: (v: boolean) => void; mobileOpen: boolean; setMobileOpen: (v: boolean) => void; }> = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const [active, setActive] = useState('dashboard');

  useEffect(() => {
    const found = menuItems.find(item => location.pathname.startsWith(item.path));
    setActive(found ? found.key : 'dashboard');
  }, [location.pathname]);

  // 记忆折叠状态
  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  return (
    <>
      {/* 移动端遮罩 */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-30 transition-opacity md:hidden ${mobileOpen ? 'block' : 'hidden'}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`fixed z-40 top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm transition-transform duration-200
          ${collapsed ? 'w-16' : 'w-56'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block
        `}
      >
        {/* Logo与折叠按钮 */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <span className="font-bold text-lg text-blue-600 tracking-wide">久火ERP</span>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            <MenuOutlined />
          </button>
          <button
            className="hidden md:block p-2 rounded hover:bg-gray-100"
            onClick={() => setCollapsed(!collapsed)}
          >
            <MenuOutlined />
          </button>
        </div>
        {/* 菜单 */}
        <nav className="mt-2">
          {menuItems.map(item => (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 mx-2 my-1 rounded-lg transition-all
                ${active === item.key ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
                ${collapsed ? 'justify-center' : ''}
              `}
              title={item.label}
            >
              {item.icon}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
          {/* 退出登录 */}
          <button
            className={`flex items-center gap-3 px-4 py-2 mx-2 my-1 rounded-lg w-full text-left text-gray-700 hover:bg-gray-100 transition-all ${collapsed ? 'justify-center' : ''}`}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            <LogoutOutlined />
            {!collapsed && <span>退出登录</span>}
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar; 