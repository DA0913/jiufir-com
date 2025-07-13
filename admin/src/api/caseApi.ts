import request from './request';

export interface CustomerCase {
  id: number;
  title: string;
  client_logo?: string;
  industry: string;
  cooperation_date: string;
  description: string;
  cover_image?: string;
  related_links?: string[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CaseListParams {
  page?: number;
  pageSize?: number;
  industry?: string;
  status?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export interface CaseListResponse {
  data: CustomerCase[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateCaseParams {
  title: string;
  client_logo?: string;
  industry: string;
  cooperation_date: string;
  description: string;
  cover_image?: string;
  related_links?: string[];
  status?: string;
}

export const caseApi = {
  // 获取案例列表
  getList: (params: CaseListParams): Promise<CaseListResponse> => {
    return request.get('/cases', { params });
  },

  // 获取案例详情
  getDetail: (id: number): Promise<CustomerCase> => {
    return request.get(`/cases/${id}`);
  },

  // 创建案例
  create: (data: CreateCaseParams): Promise<CustomerCase> => {
    return request.post('/cases', data);
  },

  // 更新案例
  update: (id: number, data: Partial<CreateCaseParams>): Promise<CustomerCase> => {
    return request.put(`/cases/${id}`, data);
  },

  // 删除案例
  delete: (id: number): Promise<void> => {
    return request.delete(`/cases/${id}`);
  },

  // 批量删除
  batchDelete: (ids: number[]): Promise<void> => {
    return request.post('/cases/batch-delete', { ids });
  },

  // 批量更新状态
  batchUpdateStatus: (ids: number[], status: string): Promise<void> => {
    return request.post('/cases/batch-update-status', { ids, status });
  },

  // 获取行业列表
  getIndustries: (): Promise<string[]> => {
    return request.get('/cases/industries');
  },

  // 导出案例数据
  export: (params: CaseListParams): Promise<Blob> => {
    return request.get('/cases/export', { 
      params,
      responseType: 'blob'
    });
  },
}; 