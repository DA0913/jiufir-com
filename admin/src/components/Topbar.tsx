import React from 'react';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import GlobalSearch from './GlobalSearch';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-100 shadow-sm">
      {/* 移动端汉堡按钮 */}
      <button className="md:hidden p-2 rounded hover:bg-gray-100" onClick={onMenuClick}>
        <MenuOutlined />
      </button>
      {/* 全局搜索框 */}
      <div className="flex-1 flex items-center justify-center">
        <GlobalSearch />
      </div>
      {/* 用户头像/操作区 */}
      <div className="flex items-center gap-3">
        <UserOutlined className="text-gray-400" />
        <span className="hidden md:inline text-gray-600 text-sm">管理员</span>
      </div>
    </header>
  );
};

export default Topbar; 