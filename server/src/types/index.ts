// 数据库模型类型定义
export interface FormSubmission {
  id: string;
  company_name: string;
  user_name: string;
  phone: string;
  company_types: string[];
  source_url: string;
  submitted_at: Date;
  status: 'pending' | 'processing' | 'completed' | 'invalid';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  publish_time: Date;
  image_url?: string;
  summary?: string;
  content?: string;
  views: number;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerCase {
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
  created_at: Date;
  updated_at: Date;
}

export interface CaseConfiguration {
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
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
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
import type { Request as ExpressRequest } from 'express';
export interface AuthenticatedRequest extends ExpressRequest {
  user?: Omit<User, 'password_hash'>;
}

// 错误类型
export interface ApiError {
  message: string;
  status: number;
  code?: string;
} 