import axios, { type AxiosRequestConfig } from 'axios';
import { isDevelopment } from '@/env';
import {
  API_CONFIG,
  API_ERROR_CODE,
  API_ERROR_MESSAGE,
  API_ERROR_TITLE,
  HTTP_STATUS_CODE,
} from '@/config/api';
import { StorageKey } from '@/config/auth';
import { useErrorStore } from '@/shared/stores/errorStore';
import { authStore } from '@/shared/stores/authStore';
import { isRecord } from '@/shared/utils/guards';

/** API 統一エラー形式 */
type ApiError = {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
};

/** 認証エラー用例外 */
class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/** Axios 共通インスタンス */
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT_MS,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/** Orval 用 Axios mutator */
export const customInstance = <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance(config).then((res) => res.data);
};

/** リクエスト前処理 */
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/** レスポンス共通エラーハンドリング */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      if (isDevelopment) {
        console.error('[API ERROR] Network Error', {
          message: error.message,
          config: error.config,
        });
      }

      useErrorStore.getState().setError({
        title: API_ERROR_TITLE.NETWORK,
        messages: [API_ERROR_MESSAGE.NETWORK_ERROR],
      });

      return Promise.reject(error);
    }

    const { status, data } = error.response;

    if (isDevelopment) {
      console.error('[API ERROR]', {
        status,
        url: error.config?.url,
        method: error.config?.method,
        request: error.config?.data,
        response: data,
      });
    }

    if (status === HTTP_STATUS_CODE.UNAUTHORIZED) {
      clearAuthToken();
    }

    notifyByStatus(status, data);
    return Promise.reject(error);
  }
);

// TODO:ローカルストレージじゃなくなる。。
/** 認証トークン取得 */
export const getAuthToken = (): string | null =>
  localStorage.getItem(StorageKey.AuthToken);

/** 認証トークン保存 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(StorageKey.AuthToken, token);
};

/** 認証トークン削除 */
export const clearAuthToken = (): void => {
  localStorage.removeItem(StorageKey.AuthToken);
};

/** API エラーレスポンスからメッセージを抽出 */
const extractErrorMessages = (data: unknown): string[] => {
  if (!isRecord(data)) return [];

  const messages: string[] = [];

  if (typeof data.message === 'string' && data.message.trim()) {
    messages.push(data.message);
  }

  if (isRecord(data.errors)) {
    Object.values(data.errors).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v === 'string' && v.trim()) {
            messages.push(v);
          }
        });
      } else if (typeof value === 'string' && value.trim()) {
        messages.push(value);
      }
    });
  }

  return Array.from(new Set(messages));
};

/** Laravel API のエラー形式かどうか */
const isApiError = (value: unknown): value is ApiError => {
  if (!isRecord(value)) return false;
  return typeof value.message === 'string' && typeof value.code === 'string';
};

/** ステータス・エラーコードに応じて通知処理を行う */
const notifyByStatus = (
  status: number | undefined,
  data: unknown
): void => {
  const messages = extractErrorMessages(data);
  const code = isApiError(data) ? data.code : undefined;

  if (code === API_ERROR_CODE.AUTH || status === HTTP_STATUS_CODE.UNAUTHORIZED) {
    authStore.getState().reset();
    throw new UnauthorizedError();
  }

  const { setError } = useErrorStore.getState();

  if (
    code === API_ERROR_CODE.VALIDATION ||
    status === HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY
  ) {
    setError({
      status,
      title: API_ERROR_TITLE.VALIDATION,
      messages: messages.length ? messages : [API_ERROR_MESSAGE.REQUEST_FAILED],
    });
    return;
  }

  if (
    code === API_ERROR_CODE.DOMAIN ||
    code === API_ERROR_CODE.FORBIDDEN ||
    code === API_ERROR_CODE.NOT_FOUND ||
    (status !== undefined &&
      status >= HTTP_STATUS_CODE.CLIENT_ERROR_MIN &&
      status <= HTTP_STATUS_CODE.CLIENT_ERROR_MAX)
  ) {
    setError({
      status,
      title: API_ERROR_TITLE.VALIDATION,
      messages: messages.length ? messages : [API_ERROR_MESSAGE.REQUEST_FAILED],
    });
    return;
  }

  const fallback =
    status !== undefined &&
      status >= HTTP_STATUS_CODE.SERVER_ERROR_MIN
      ? API_ERROR_MESSAGE.SERVER_ERROR
      : API_ERROR_MESSAGE.GENERIC_ERROR;

  setError({
    status,
    title: API_ERROR_TITLE.SERVER,
    messages: [messages[0] ?? fallback],
  });
};