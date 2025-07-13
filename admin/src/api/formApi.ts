import request from './request';

export interface FormSubmission {
  id: number;
  form_name: string;
  submitter_name: string;
  submitter_email: string;
  submitter_phone: string;
  company_name: string;
  message: string;
  status: 'pending' | 'replied';
  created_at: string;
  updated_at: string;
}

export interface FormListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

export interface FormListResponse {
  data: FormSubmission[];
  total: number;
  page: number;
  pageSize: number;
}

export const formApi = {
  // 获取表单列表
  getList: (params: FormListParams): Promise<FormListResponse> => {
    return request.get('/forms', { params });
  },

  // 获取表单详情
  getDetail: (id: number): Promise<FormSubmission> => {
    return request.get(`/forms/${id}`);
  },

  // 更新表单状态
  updateStatus: (id: number, status: string): Promise<void> => {
    return request.patch(`/forms/${id}/status`, { status });
  },

  // 删除表单
  delete: (id: number): Promise<void> => {
    return request.delete(`/forms/${id}`);
  },

  // 批量删除
  batchDelete: (ids: number[]): Promise<void> => {
    return request.post('/forms/batch-delete', { ids });
  },

  // 导出表单数据
  export: (params: FormListParams): Promise<Blob> => {
    return request.get('/forms/export', { 
      params,
      responseType: 'blob'
    });
  },
}; 