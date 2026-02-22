/**
 * lib - Barrel Export
 * 全ライブラリモジュールの一元エクスポート
 */

// 環境変数
export { env, isProduction, isDevelopment, isTest } from '@/env';

// Axios HTTP クライアント
export { httpClient } from '@/lib/http-client';

// Query クライアント
export { createQueryClient, invalidatePatterns } from '@/lib/query-client';

// エラーハンドリング
export {
  AppError,
  ApiError,
  AuthError,
  UnauthorizedError,
  NotFoundError,
  NetworkError,
  isAppError,
  isApiError,
  isAuthError,
  isNetworkError,
} from './errors';
