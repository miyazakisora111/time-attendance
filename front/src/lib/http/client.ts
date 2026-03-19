import axios, { type AxiosRequestConfig } from 'axios';
import { toast as sonner } from 'sonner';
import { API_CONFIG, HttpStatusCode } from '@/config/api';
import { StorageKey } from '@/config/auth';
import { ApiErrorMessage, ApiErrorTitle } from '@/config/constants';

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
 * グローバルAPIエラーペイロード。
 */
type GlobalApiErrorPayload = {
  /** HTTPステータス */
  status?: number;
  /** エラータイトル */
  title: string;
  /** 表示メッセージ */
  messages: string[];
};

/**
 * グローバルAPIエラーハンドラー。
 */
type ApiErrorHandler = (payload: GlobalApiErrorPayload) => void;

/**
 * 現在登録されているエラーハンドラー。
 */
let apiErrorHandler: ApiErrorHandler | null = null;

/**
 * グローバルAPIエラーハンドラーを登録する。
 *
 * @param handler ハンドラー関数
 */
export const setApiErrorHandler = (handler: ApiErrorHandler | null): void => {
  apiErrorHandler = handler;
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
 * @param data エラーレスポンス
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
 * ステータスコードに応じてエラー通知を振り分ける。
 *
 * @param status HTTPステータス
 * @param data エラーレスポンス
 */
const notifyByStatus = (status: number | undefined, data: unknown): void => {
  const messages = extractErrorMessages(data);

  // 未ログイン状態の 401 はグローバル通知しない。
  if (status === HttpStatusCode.Unauthorized) {
    return;
  }

  // 422 と 4xx ドメインエラーは中央モーダルへ通知する。
  if (
    status === HttpStatusCode.UnprocessableEntity ||
    (
      status !== undefined &&
      status >= HttpStatusCode.ClientErrorMin &&
      status <= HttpStatusCode.ClientErrorMax &&
      status !== HttpStatusCode.Unauthorized
    )
  ) {
    apiErrorHandler?.({
      status,
      title: ApiErrorTitle.Validation,
      messages: messages.length > 0 ? messages : [ApiErrorMessage.RequestFailed],
    });
    return;
  }

  // 5xx とその他はトースト表示へフォールバックする。
  const fallbackMessage =
    status !== undefined && status >= HttpStatusCode.ServerErrorMin
      ? ApiErrorMessage.ServerError
      : ApiErrorMessage.GenericError;

  sonner.error(messages[0] ?? fallbackMessage);
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

// レスポンス共通処理
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ネットワークエラーなどでレスポンスがない場合はトースト表示する。
    if (!error.response) {
      sonner.error(ApiErrorMessage.NetworkError);
      return Promise.reject(error);
    }

    // 認証エラー時はクライアント側トークンを削除する。
    if (error.response.status === HttpStatusCode.Unauthorized) {
      clearAuthToken();
    }

    // ステータスコードに応じてエラー通知を振り分ける。
    notifyByStatus(error.response.status, error.response.data);

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

/**
 * 既存UI互換のCSRF APIダミー。
 */
export const getCsrfTokenApi = async (): Promise<void> => {
  return Promise.resolve();
};
