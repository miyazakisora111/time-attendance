import { env } from '@/env';

/** React Query キャッシュ既定時間(ms)。 */
const CACHE_STALE_TIME_MS = 60_000;

/**
 * API関連の設定値。
 */
export const API_CONFIG = {
  /** APIベースURL */
  baseUrl: env.API_URL,
  /** APIタイムアウト(ms) */
  timeoutMs: env.API_TIMEOUT,
  /** React Query キャッシュ時間(ms) */
  cacheStaleTimeMs: CACHE_STALE_TIME_MS,
} as const;

/**
 * 既存参照互換のエイリアス。
 */
export const apiConfig = API_CONFIG;

/**
 * React Query の既定動作設定。
 */
export const QUERY_CONFIG = {
  /** 通常クエリ stale time(ms) */
  defaultStaleTimeMs: 5 * 60 * 1000,
  /** 接続断エラー時リトライ上限回数 */
  maxNetworkRetryCount: 3,
  /** サーバーエラー時リトライ上限回数 */
  maxServerRetryCount: 3,
  /** リトライ遅延の初期値(ms) */
  retryDelayBaseMs: 1_000,
  /** リトライ遅延の上限(ms) */
  retryDelayMaxMs: 30_000,
} as const;

/**
 * HTTPステータスコード。
 */
export enum HttpStatusCode {
  /** 未認証 */
  Unauthorized = 401,
  /** バリデーションエラー */
  UnprocessableEntity = 422,
  /** クライアントエラー下限 */
  ClientErrorMin = 400,
  /** クライアントエラー上限 */
  ClientErrorMax = 499,
  /** サーバーエラー下限 */
  ServerErrorMin = 500,
}
