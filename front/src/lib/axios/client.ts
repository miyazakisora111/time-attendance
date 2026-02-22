import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000,
      withCredentials: true,
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
          // ここでは何もしない
          // UI層で処理させる
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
}

// シングルトン
export const httpClient = new HttpClient();
