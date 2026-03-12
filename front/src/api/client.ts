// front/src/api/client.ts
import axios, { type AxiosRequestConfig } from 'axios';
import { env } from '@/env';

export const axiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// レスポンス共通処理
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Network Error'));
    }

    if (error.response.status === 401) {
      // リフレッシュ処理 or logout
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

// Sanctum用
export const getCsrfTokenApi = async (): Promise<void> => {
  await axiosInstance.get('/sanctum/csrf-cookie');
};
