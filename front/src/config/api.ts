import { env } from '@/env';

/* ==========================================================
 * API 基本設定
 * ========================================================== */
export const API_CONFIG = {
  /** API のベース URL */
  BASE_URL: env.API_URL,

  /** HTTP 通信のタイムアウト (ms) */
  TIMEOUT_MS: env.API_TIMEOUT,
} as const;

/* ==========================================================
 * React Query 共通設定
 * ========================================================== */
export const QUERY_CONFIG = {
  /** 通常クエリの staleTime (ms) */
  DEFAULT_STALE_TIME_MS: 5 * 60 * 1000,

  /** ネットワークエラー時の最大リトライ回数 */
  MAX_NETWORK_RETRY_COUNT: 3,

  /** サーバーエラー時の最大リトライ回数 */
  MAX_SERVER_RETRY_COUNT: 3,

  /** リトライ遅延の初期値 (ms) */
  RETRY_DELAY_BASE_MS: 1_000,

  /** リトライ遅延の最大値 (ms) */
  RETRY_DELAY_MAX_MS: 30_000,
} as const;

/* ==========================================================
 * HTTP ステータスコード
 * ========================================================== */
export const HTTP_STATUS_CODE = {
  /** 未認証 */
  UNAUTHORIZED: 401,

  /** バリデーションエラー */
  UNPROCESSABLE_ENTITY: 422,

  /** クライアントエラー範囲 */
  CLIENT_ERROR_MIN: 400,
  CLIENT_ERROR_MAX: 499,

  /** サーバーエラー範囲 */
  SERVER_ERROR_MIN: 500,
} as const;

export type HttpStatusCode =
  typeof HTTP_STATUS_CODE[keyof typeof HTTP_STATUS_CODE];

/* ==========================================================
 * API エラーコード
 *
 * Laravel Handler.php の error_code と一致させること
 * ========================================================== */
export const API_ERROR_CODE = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTH_ERROR',
  FORBIDDEN: 'FORBIDDEN_ERROR',
  DOMAIN: 'DOMAIN_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL: 'INTERNAL_ERROR',
} as const;

export type ApiErrorCode =
  typeof API_ERROR_CODE[keyof typeof API_ERROR_CODE];

/* ==========================================================
 * API エラー表示（UI 向け）
 * ========================================================== */
export const API_ERROR_TITLE = {
  /** 入力エラー */
  VALIDATION: '入力内容を確認してください',

  /** サーバーエラー */
  SERVER: 'サーバーエラー',

  /** ネットワークエラー */
  NETWORK: '通信エラー',
} as const;

export const API_ERROR_MESSAGE = {
  /** 4xx 系のデフォルト */
  REQUEST_FAILED: 'HTTPリクエストが処理できませんでした。',

  /** 5xx 系のデフォルト */
  SERVER_ERROR:
    'サーバーエラーが発生しました。時間をおいて再度お試しください。',

  /** ネットワークエラー */
  NETWORK_ERROR:
    'ネットワークエラーが発生しました。接続を確認してください。',

  /** その他の想定外エラー */
  GENERIC_ERROR: 'エラーが発生しました。',
} as const;