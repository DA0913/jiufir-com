import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 自动添加token
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 清除失效token
      localStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_token');
      // 跳转到登录页
      window.location.href = '/login';
      message.error('登录已过期，请重新登录');
    } else {
      // 统一错误提示
      const errorMessage = (error.response?.data as any)?.message || error.message || '请求失败';
      message.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

export default request; 