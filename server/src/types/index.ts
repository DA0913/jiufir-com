// 数据库模型类型定义 (SQLite 版本)
export interface FormSubmission {
  id: number;
  company_name: string;
  user_name: string;
  phone: string;
  company_types: string[]; // 在 SQLite 中存储为 JSON 字符串
  source_url: string;
  submitted_at: string; // SQLite 中时间存储为 TEXT
  status: 'pending' | 'processing' | 'completed' | 'invalid';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  category: string;
  publish_time: string; // SQLite 中时间存储为 TEXT
  image_url?: string;
  summary?: string;
  content?: string;
  views: number;
  is_featured: number; // SQLite 中布尔值存储为 INTEGER (0/1)
  created_at: string;
  updated_at: string;
}

export interface CustomerCase {
  id: number;
  company_name: string;
  company_logo: string;
  industry: string;
  description: string;
  results: string;
  metrics: Record<string, any>; // 在 SQLite 中存储为 JSON 字符串
  is_featured: number; // SQLite 中布尔值存储为 INTEGER (0/1)
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CaseConfiguration {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  company_name: string;
  company_logo: string;
  stock_code?: string;
  image_url?: string;
  link_url?: string;
  is_active: number; // SQLite 中布尔值存储为 INTEGER (0/1)
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  is_active: number; // SQLite 中布尔值存储为 INTEGER (0/1)
  created_at: string;
  updated_at: string;
}

// API请求/响应类型
export interface CreateFormSubmissionRequest {
  company_name: string;
  user_name: string;
  phone: string;
  company_types: string[];
  source_url: string;
}

export interface UpdateFormSubmissionRequest {
  status?: 'pending' | 'processing' | 'completed' | 'invalid';
  notes?: string;
}

export interface CreateNewsArticleRequest {
  title: string;
  category: string;
  publish_time: string;
  image_url?: string;
  summary?: string;
  content?: string;
  is_featured?: boolean;
}

export interface CreateCustomerCaseRequest {
  company_name: string;
  company_logo: string;
  industry: string;
  description: string;
  results: string;
  metrics: Record<string, any>;
  is_featured?: boolean;
  sort_order?: number;
  status?: 'active' | 'inactive';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'password_hash'>;
}

// 数据库查询结果类型
export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 中间件类型
export interface AuthenticatedRequest extends Request {
  user?: Omit<User, 'password_hash'>;
}

// 错误类型
export interface ApiError {
  message: string;
  status: number;
  code?: string;
} 