import request from './request';

export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
    avatar?: string;
  };
}

export const authApi = {
  // 登录
  login: (data: LoginParams): Promise<LoginResponse> => {
    return request.post('/auth/login', data);
  },

  // 登出
  logout: (): Promise<void> => {
    return request.post('/auth/logout');
  },

  // 获取当前用户信息
  getCurrentUser: (): Promise<LoginResponse['user']> => {
    return request.get('/auth/me');
  },

  // 刷新token
  refreshToken: (): Promise<{ token: string }> => {
    return request.post('/auth/refresh');
  },
}; 