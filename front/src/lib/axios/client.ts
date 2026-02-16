/**
 * Axios クライアント (型安全)
 * Sanctum Cookie 認証対応
 * 
 * 特徴:
 * - withCredentials: true (自動)
 * - 401 時自動ログアウト
 * - エラーハンドリング統一
 * - レスポンス型定義
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { env } from '../env';
import {
  ApiError,
  AuthError,
  NetworkError,
} from '../errors';
import type { ApiResponse } from './types';

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: env.API_URL,
      timeout: env.API_TIMEOUT,
      // ✅ Sanctum: Cookie ベース認証
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // リクエストインターセプター
    this.instance.interceptors.request.use(
      (config) => {
        if (env.DEBUG) {
          console.debug('[HTTP] Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
          });
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // レスポンスインターセプター
    this.instance.interceptors.response.use(
      (response) => {
        if (env.DEBUG) {
          console.debug('[HTTP] Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }
        return response;
      },
      (error) => {
        // ネットワークエラー
        if (!error.response) {
          const networkError = new NetworkError(
            error.message || 'ネットワークエラーが発生しました'
          );
          return Promise.reject(networkError);
        }

        const { status } = error.response;
        const errorData = error.response.data as Record<string, unknown>;
        const message = (errorData?.message as string) || error.message;

        // 401: 認証が必要
        if (status === 401) {
          // ✅ グローバル認証エラーハンドリング
          // Zustand store で logout を呼び出す
          // 詳細は interceptors.ts 参照
          const authError = new AuthError(message);
          return Promise.reject(authError);
        }

        // 422: バリデーションエラー
        if (status === 422) {
          const validationErrors = errorData?.errors || {};
          const apiError = new ApiError(message, status, validationErrors);
          return Promise.reject(apiError);
        }

        // その他の API エラー
        const apiError = new ApiError(
          message,
          status,
          errorData?.errors
        );
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * GET リクエスト
   */
  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * POST リクエスト
   */
  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(
      url,
      data,
      config
    );
    return response.data;
  }

  /**
   * PUT リクエスト
   */
  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(
      url,
      data,
      config
    );
    return response.data;
  }

  /**
   * PATCH リクエスト
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(
      url,
      data,
      config
    );
    return response.data;
  }

  /**
   * DELETE リクエスト
   */
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * 生の Axios インスタンスへのアクセス
   * (特殊なケースのみ使用)
   */
  getRawInstance(): AxiosInstance {
    return this.instance;
  }
}

// シングルトン
export const httpClient = new HttpClient();
