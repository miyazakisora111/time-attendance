/**
 * lib - Barrel Export
 * 全ライブラリモジュールの一元エクスポート
 */

// 環境変数
export { env, isProduction, isDevelopment, isTest } from './env';

// Axios HTTP クライアント
export { httpClient, setupAuthInterceptor } from './axios';
export type { ApiResponse, ApiErrorResponse, PaginatedResponse } from './axios/types';

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

// TanStack Query
export { createQueryClient, queryKeys, invalidatePatterns } from './query-client';
