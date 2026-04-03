import axios, { type AxiosRequestConfig } from 'axios';
import { isDevelopment } from '@/env';
import { API_CONFIG, HttpStatusCode } from '@/config/api';
import { StorageKey } from '@/config/auth';
import { ApiErrorMessage, ApiErrorTitle } from '@/config/constants';
import { ApiErrorCode, isApiError, UnauthorizedError } from '@/lib/http/api-error';
import { useErrorStore } from '@/shared/stores/errorStore';
import { authStore } from '@/shared/stores/authStore';

/**
 * Axios共通インスタンス。
 */
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeoutMs,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * localStorage から認証トークンを取得する。
 */
export const getAuthToken = (): string | null => localStorage.getItem(StorageKey.AuthToken);

/**
 * 認証トークンを localStorage へ保存する。
 *
 * @param token JWTトークン
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(StorageKey.AuthToken, token);
};

/**
 * localStorage から認証トークンを削除する。
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem(StorageKey.AuthToken);
};

/**
 * オブジェクト判定を行う型ガード。
 */
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

/**
 * APIエラーオブジェクトからメッセージ配列を抽出する。
 *
 * @param data エラーHTTPレスポンス
 */
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

/**
 * エラーコードとステータスに応じてエラーストアへ通知する。
 *
 * @param status HTTPステータス
 * @param data エラーHTTPレスポンス
 */
const notifyByStatus = (status: number | undefined, data: unknown): void => {
  const messages = extractErrorMessages(data);
  const code = isApiError(data) ? data.code : undefined;

  // 認証エラー（401）はグローバル通知しない（トークン削除のみ）。
  if (code === ApiErrorCode.Auth || status === HttpStatusCode.Unauthorized) {
    authStore.getState().reset()
    throw new UnauthorizedError()
  }

  const { setError } = useErrorStore.getState();

  // バリデーションエラーはモーダルへ通知する。
  if (code === ApiErrorCode.Validation) {
    setError({
      status,
      title: ApiErrorTitle.Validation,
      messages: messages.length > 0 ? messages : [ApiErrorMessage.RequestFailed],
    });
    return;
  }

  // ドメインエラー・権限エラー・Not Found はモーダルへ通知する。
  if (
    code === ApiErrorCode.Domain ||
    code === ApiErrorCode.Forbidden ||
    code === ApiErrorCode.NotFound ||
    (
      status !== undefined &&
      status >= HttpStatusCode.ClientErrorMin &&
      status <= HttpStatusCode.ClientErrorMax
    )
  ) {
    setError({
      status,
      title: ApiErrorTitle.Validation,
      messages: messages.length > 0 ? messages : [ApiErrorMessage.RequestFailed],
    });
    return;
  }

  // 5xx とその他もモーダルへ通知する。
  const fallbackMessage =
    status !== undefined && status >= HttpStatusCode.ServerErrorMin
      ? ApiErrorMessage.ServerError
      : ApiErrorMessage.GenericError;

  setError({
    status,
    title: ApiErrorTitle.Server,
    messages: [messages[0] ?? fallbackMessage],
  });
};

/**
 * APIリクエスト送信前に認証ヘッダーを付与する。
 */
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();

  // トークンがある場合のみ Authorization ヘッダーを付与する。
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// HTTPレスポンス共通処理
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ネットワークエラー
    if (!error.response) {
      if (isDevelopment) {
        console.error('[API ERROR] Network Error', {
          message: error.message,
          config: error.config,
        });
      }

      useErrorStore.getState().setError({
        title: ApiErrorTitle.Network,
        messages: [ApiErrorMessage.NetworkError],
      });
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // 開発環境のみログを出力
    if (isDevelopment) {
      console.error('[API ERROR]', {
        status,
        url: error.config?.url,
        method: error.config?.method,
        request: error.config?.data,
        response: data,
      });
    }

    // 認証エラー
    if (status === HttpStatusCode.Unauthorized) {
      clearAuthToken();
    }

    notifyByStatus(status, data);

    return Promise.reject(error);
  }
);

/**
 * Orval 用 Axios mutator。
 *
 * @param config Axios設定
 */
export const customInstance = <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  return axiosInstance(config).then((res) => res.data);
};


