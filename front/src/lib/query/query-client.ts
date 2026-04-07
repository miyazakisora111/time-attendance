import { QueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { HTTP_STATUS_CODE, QUERY_CONFIG } from '@/config/api';

/**
 * AxiosError 判定の型ガード。
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError)?.isAxiosError === true;
}

/**
 * アプリ共通 QueryClient を生成する。
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME_MS,
        retry: (failureCount: number, error: unknown) => {

          // Axios でないエラーはリトライ
          if (!isAxiosError(error)) return failureCount < QUERY_CONFIG.MAX_NETWORK_RETRY_COUNT;

          // ネットワークエラー
          if (!error.response) return failureCount < QUERY_CONFIG.MAX_NETWORK_RETRY_COUNT;

          // 4xx はリトライなし
          if (
            error.response.status >= HTTP_STATUS_CODE.CLIENT_ERROR_MIN &&
            error.response.status <= HTTP_STATUS_CODE.CLIENT_ERROR_MAX
          ) {
            return false;
          }

          // 5xx は最大3回
          return failureCount < QUERY_CONFIG.MAX_SERVER_RETRY_COUNT;
        },
        retryDelay: (attemptIndex) => Math.min(
          QUERY_CONFIG.RETRY_DELAY_BASE_MS * 2 ** attemptIndex,
          QUERY_CONFIG.RETRY_DELAY_MAX_MS,
        ),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
