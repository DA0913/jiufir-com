// MySQL数据库配置文件
// 注意：这里只是类型定义，实际的MySQL连接需要在后端实现

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

// MySQL API 接口函数
export const submitForm = async (formData: Omit<FormSubmission, 'id' | 'created_at' | 'updated_at' | 'submitted_at'>) => {
  try {
    const response = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('提交失败');
    }

    return await response.json();
  } catch (error) {
    console.error('表单提交错误:', error);
    throw error;
  }
};

export const getNewsArticles = async () => {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) {
      throw new Error('获取新闻失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取新闻错误:', error);
    throw error;
  }
};

export const getCustomerCases = async () => {
  try {
    const response = await fetch('/api/cases');
    if (!response.ok) {
      throw new Error('获取案例失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取案例错误:', error);
    throw error;
  }
};