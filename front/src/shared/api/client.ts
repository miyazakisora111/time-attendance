/**
 * Axios API クライアント
 * 型安全なAPI通信
 */

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useAuthStore } from '../store';
import type { ApiResponse } from '../types';

class ApiClient {
  private instance: any;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // リクエストインターセプター
    this.instance.interceptors.request.use(
      (config: any) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // レスポンスインターセプター
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        // 401 Unauthorized の場合はログアウト
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse } from '../types';

// API エンドポイント定義
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
  },
  users: {
    list: '/users',
    get: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  attendance: {
    list: '/attendance',
    get: (id: string) => `/attendance/${id}`,
    clockIn: '/attendance/clock-in',
    clockOut: '/attendance/clock-out',
    records: (userId: string) => `/attendance/users/${userId}`,
    monthly: (year: number, month: number) => `/attendance/monthly/${year}/${month}`,
  },
} as const;

