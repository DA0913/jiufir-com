// API客户端配置
// 替换原有的Supabase客户端，改为调用后端API

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// 通用API请求函数
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// 类型定义（保持与原supabase.ts兼容）
export type FormSubmission = {
  id: string;
  company_name: string;
  user_name: string;
  phone: string;
  company_types: string[];
  source_url: string;
  submitted_at: string;
  status: 'pending' | 'processing' | 'completed' | 'invalid';
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  category: string;
  publish_time: string;
  image_url?: string;
  summary?: string;
  content?: string;
  views: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type CustomerCase = {
  id: string;
  company_name: string;
  company_logo: string;
  industry: string;
  description: string;
  results: string;
  metrics: Record<string, any>;
  is_featured: boolean;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type CaseConfiguration = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  company_name: string;
  company_logo: string;
  stock_code?: string;
  image_url?: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// 表单相关API
export const submitForm = async (formData: Omit<FormSubmission, 'id' | 'created_at' | 'updated_at' | 'submitted_at'>) => {
  try {
    const response = await apiRequest('/forms/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (!response.success) {
      throw new Error(response.message || '提交失败');
    }

    return response.data;
  } catch (error) {
    console.error('表单提交错误:', error);
    throw error;
  }
};

// 新闻相关API
export const getNewsArticles = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await apiRequest(`/news?page=${page}&limit=${limit}`);
    
    if (!response.success) {
      throw new Error(response.message || '获取新闻失败');
    }

    return response.data;
  } catch (error) {
    console.error('获取新闻错误:', error);
    throw error;
  }
};

export const getFeaturedNewsArticles = async (limit: number = 5) => {
  try {
    const response = await apiRequest(`/news/featured?limit=${limit}`);
    
    if (!response.success) {
      throw new Error(response.message || '获取精选新闻失败');
    }

    return response.data;
  } catch (error) {
    console.error('获取精选新闻错误:', error);
    throw error;
  }
};

export const getNewsArticleById = async (id: string) => {
  try {
    const response = await apiRequest(`/news/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || '获取新闻详情失败');
    }

    return response.data;
  } catch (error) {
    console.error('获取新闻详情错误:', error);
    throw error;
  }
};

export const getNewsArticlesByCategory = async (category: string, page: number = 1, limit: number = 10) => {
  try {
    const response = await apiRequest(`/news/category/${category}?page=${page}&limit=${limit}`);
    
    if (!response.success) {
      throw new Error(response.message || '获取分类新闻失败');
    }

    return response.data;
  } catch (error) {
    console.error('获取分类新闻错误:', error);
    throw error;
  }
};

export const getNewsCategories = async () => {
  try {
    const response = await apiRequest('/news/categories/list');
    
    if (!response.success) {
      throw new Error(response.message || '获取新闻分类失败');
    }

    return response.data;
  } catch (error) {
    console.error('获取新闻分类错误:', error);
    throw error;
  }
};

// 客户案例相关API
export const getCustomerCases = async () => {
  try {
    // 这里需要后端实现客户案例的API
    // 暂时返回空数组，等待后端实现
    return [];
  } catch (error) {
    console.error('获取案例错误:', error);
    throw error;
  }
};

// 管理员API（需要认证）
export const getFormSubmissions = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await apiRequest(`/forms?page=${page}&limit=${limit}`);
    
    if (!response.success) {
      throw new Error(response.message || '获取表单提交失败');
    }

    return response.data;
  } catch (error) {
    console.error('获取表单提交错误:', error);
    throw error;
  }
};

export const updateFormSubmission = async (id: string, data: { status?: string; notes?: string }) => {
  try {
    const response = await apiRequest(`/forms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.success) {
      throw new Error(response.message || '更新失败');
    }

    return response.data;
  } catch (error) {
    console.error('更新表单提交错误:', error);
    throw error;
  }
};

export const deleteFormSubmission = async (id: string) => {
  try {
    const response = await apiRequest(`/forms/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || '删除失败');
    }

    return response.data;
  } catch (error) {
    console.error('删除表单提交错误:', error);
    throw error;
  }
};

export const getFormSubmissionStats = async () => {
  try {
    const response = await apiRequest('/forms/stats/summary');
    
    if (!response.success) {
      throw new Error(response.message || '获取统计失败');
    }

    return response.data;
  } catch (error) {
    console.error('获取表单统计错误:', error);
    throw error;
  }
}; 