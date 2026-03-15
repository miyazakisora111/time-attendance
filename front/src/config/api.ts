import { env } from '@/env';

/**
 * API関連の設定値。
 */
export const apiConfig = {
  /** APIベースURL */
  baseUrl: env.API_URL,
  /** APIタイムアウト(ms) */
  timeoutMs: env.API_TIMEOUT,
  /** React Query キャッシュ時間(ms) */
  cacheStaleTimeMs: 60_000,
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
