import request from './request';

export interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  cover_image?: string;
  author: string;
  is_top: boolean;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export interface NewsListResponse {
  data: News[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateNewsParams {
  title: string;
  summary: string;
  content: string;
  cover_image?: string;
  author: string;
  is_top?: boolean;
  status?: string;
  published_at?: string;
}

export const newsApi = {
  // 获取新闻列表
  getList: (params: NewsListParams): Promise<NewsListResponse> => {
    return request.get('/news', { params });
  },

  // 获取新闻详情
  getDetail: (id: number): Promise<News> => {
    return request.get(`/news/${id}`);
  },

  // 创建新闻
  create: (data: CreateNewsParams): Promise<News> => {
    return request.post('/news', data);
  },

  // 更新新闻
  update: (id: number, data: Partial<CreateNewsParams>): Promise<News> => {
    return request.put(`/news/${id}`, data);
  },

  // 删除新闻
  delete: (id: number): Promise<void> => {
    return request.delete(`/news/${id}`);
  },

  // 批量删除
  batchDelete: (ids: number[]): Promise<void> => {
    return request.post('/news/batch-delete', { ids });
  },

  // 批量更新状态
  batchUpdateStatus: (ids: number[], status: string): Promise<void> => {
    return request.post('/news/batch-update-status', { ids, status });
  },

  // 导出新闻数据
  export: (params: NewsListParams): Promise<Blob> => {
    return request.get('/news/export', { 
      params,
      responseType: 'blob'
    });
  },
}; 