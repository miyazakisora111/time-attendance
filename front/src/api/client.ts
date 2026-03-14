// front/src/api/client.ts
import axios, { type AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
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

type GlobalApiErrorPayload = {
  status?: number;
  title: string;
  messages: string[];
};

type ApiErrorHandler = (payload: GlobalApiErrorPayload) => void;

let apiErrorHandler: ApiErrorHandler | null = null;

export const setApiErrorHandler = (handler: ApiErrorHandler | null): void => {
  apiErrorHandler = handler;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const extractErrorMessages = (data: unknown): string[] => {
  if (!isRecord(data)) {
    return [];
  }

  const messages: string[] = [];

  if (typeof data.message === 'string' && data.message.trim()) {
    messages.push(data.message);
  }

  if (isRecord(data.errors)) {
    Object.values(data.errors).forEach((errorValue) => {
      if (Array.isArray(errorValue)) {
        errorValue.forEach((item) => {
          if (typeof item === 'string' && item.trim()) {
            messages.push(item);
          }
        });
      } else if (typeof errorValue === 'string' && errorValue.trim()) {
        messages.push(errorValue);
      }
    });
  }

  return Array.from(new Set(messages));
};

const notifyByStatus = (status: number | undefined, data: unknown): void => {
  const messages = extractErrorMessages(data);

  // 未ログイン状態の 401 は想定内のため、グローバル通知しない
  if (status === 401) {
    return;
  }

  // 422 + 4xx ドメインエラーは中央モーダルへ
  if (status === 422 || (status !== undefined && status >= 400 && status < 500 && status !== 401)) {
    apiErrorHandler?.({
      status,
      title: '入力内容を確認してください',
      messages: messages.length > 0 ? messages : ['リクエストが処理できませんでした。'],
    });
    return;
  }

  // 5xx, 401, その他は Sonner トーストへ
  const fallbackMessage =
    status !== undefined && status >= 500
      ? 'サーバーエラーが発生しました。時間をおいて再度お試しください。'
      : 'エラーが発生しました。';

  toast.error(messages[0] ?? fallbackMessage);
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
      toast.error('ネットワークエラーが発生しました。接続を確認してください。');
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      clearAuthToken();
    }

    notifyByStatus(error.response.status, error.response.data);

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
