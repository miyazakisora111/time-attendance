// front/src/api/client.ts
import axios, { type AxiosRequestConfig } from 'axios';
import { env } from '@/env';

const AUTH_TOKEN_KEY = 'time-attendance.auth-token';

export const axiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const getAuthToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// レスポンス共通処理
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Network Error'));
    }

    if (error.response.status === 401) {
      clearAuthToken();
    }

    return Promise.reject(error);
  }
);

// Orval用mutator
export const customInstance = <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance(config).then((res) => res.data);
};

// 既存UI互換用
export const getCsrfTokenApi = async (): Promise<void> => {
  return Promise.resolve();
};
