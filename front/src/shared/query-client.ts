import { QueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { HttpStatusCode, QUERY_CONFIG } from '@/config/api';

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
        staleTime: QUERY_CONFIG.defaultStaleTimeMs,
        retry: (failureCount: number, error: unknown) => {

          // Axios でないエラーはリトライ
          if (!isAxiosError(error)) return failureCount < QUERY_CONFIG.maxNetworkRetryCount;

          // ネットワークエラー
          if (!error.response) return failureCount < QUERY_CONFIG.maxNetworkRetryCount;

          // 4xx はリトライなし
          if (
            error.response.status >= HttpStatusCode.ClientErrorMin &&
            error.response.status <= HttpStatusCode.ClientErrorMax
          ) {
            return false;
          }

          // 5xx は最大3回
          return failureCount < QUERY_CONFIG.maxServerRetryCount;
        },
        retryDelay: (attemptIndex) => Math.min(
          QUERY_CONFIG.retryDelayBaseMs * 2 ** attemptIndex,
          QUERY_CONFIG.retryDelayMaxMs,
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
