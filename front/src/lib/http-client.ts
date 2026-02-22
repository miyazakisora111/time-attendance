import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { env } from '@/env';

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: env.API_URL,          // ここを env で置き換え
      timeout: env.API_TIMEOUT,       // env から取得
      withCredentials: true,          // Cookie を扱う場合は必須
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          return Promise.reject(new Error('Network Error'));
        }

        if (error.response.status === 401) {
          // UI 層で処理
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.get<T>(url, config);
    return res.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const res = await this.instance.post<T>(url, data);
    return res.data;
  }

  async delete<T>(url: string): Promise<T> {
    const res = await this.instance.delete<T>(url);
    return res.data;
  }

  /**
   * CSRFトークン取得 (Laravel Sanctum)
   * /sanctum/csrf-cookie に GET して XSRF-TOKEN Cookie を取得
   */
  async getCsrfToken(): Promise<void> {
    await this.instance.get('/sanctum/csrf-cookie');
  }
}

// シングルトン
export const httpClient = new HttpClient();
