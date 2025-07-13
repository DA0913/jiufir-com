import React, { useState, useEffect, useRef } from 'react';
import { Input, Dropdown, List, Avatar } from 'antd';
import { SearchOutlined, FileTextOutlined, UserOutlined, RiseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

interface SearchResult {
  id: number;
  title: string;
  type: 'news' | 'case' | 'form' | 'knowledge';
  summary?: string;
  url: string;
}

interface GlobalSearchProps {
  onSearch?: (keyword: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setResults([]);
      setVisible(false);
      return;
    }

    setLoading(true);
    try {
      // 这里应该调用后端搜索API
      // const response = await searchApi.globalSearch(value);
      // setResults(response.data);
      
      // 模拟搜索结果
      const mockResults: SearchResult[] = [
        {
          id: 1,
          title: '示例新闻标题',
          type: 'news',
          summary: '这是一条示例新闻的摘要...',
          url: '/news/1'
        },
        {
          id: 2,
          title: '示例客户案例',
          type: 'case',
          summary: '这是一个示例客户案例的描述...',
          url: '/cases/2'
        }
      ];
      setResults(mockResults);
      setVisible(true);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    
    // 防抖搜索
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setVisible(false);
    setKeyword('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <FileTextOutlined className="text-blue-500" />;
      case 'case':
        return <RiseOutlined className="text-green-500" />;
      case 'form':
        return <UserOutlined className="text-orange-500" />;
      default:
        return <FileTextOutlined className="text-gray-500" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'news':
        return '新闻';
      case 'case':
        return '案例';
      case 'form':
        return '表单';
      case 'knowledge':
        return '智库';
      default:
        return '其他';
    }
  };

  const searchOverlay = () => (
    <div className="w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center text-gray-500">搜索中...</div>
      ) : results.length > 0 ? (
        <List
          dataSource={results}
          renderItem={(item) => (
            <List.Item
              className="cursor-pointer hover:bg-gray-50 px-4 py-3"
              onClick={() => handleResultClick(item)}
            >
              <List.Item.Meta
                avatar={<Avatar icon={getTypeIcon(item.type)} />}
                title={
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-gray-400">{getTypeText(item.type)}</span>
                  </div>
                }
                description={
                  <div className="text-xs text-gray-500 mt-1">
                    {item.summary}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : keyword ? (
        <div className="p-4 text-center text-gray-500">未找到相关结果</div>
      ) : null}
    </div>
  );

  return (
    <Dropdown
      overlay={searchOverlay()}
      open={visible}
      onOpenChange={setVisible}
      trigger={['click']}
      placement="bottomLeft"
    >
      <Search
        placeholder="搜索新闻、案例、表单..."
        value={keyword}
        onChange={handleInputChange}
        onSearch={handleSearch}
        className="w-64"
        allowClear
      />
    </Dropdown>
  );
};

export default GlobalSearch; 