import request from './request';

export interface DashboardStats {
  totalForms: number;
  totalNews: number;
  totalCases: number;
  totalKnowledge: number;
  pendingForms: number;
  publishedNews: number;
  activeCases: number;
}

export interface TrendData {
  date: string;
  forms: number;
  news: number;
  cases: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  trends: TrendData[];
}

export const dashboardApi = {
  // 获取仪表盘数据
  getDashboard: (period: 'day' | 'week' | 'month' = 'day'): Promise<DashboardResponse> => {
    return request.get('/dashboard', { params: { period } });
  },

  // 获取统计数据
  getStats: (): Promise<DashboardStats> => {
    return request.get('/dashboard/stats');
  },

  // 获取趋势数据
  getTrends: (period: 'day' | 'week' | 'month' = 'day'): Promise<TrendData[]> => {
    return request.get('/dashboard/trends', { params: { period } });
  },
}; 