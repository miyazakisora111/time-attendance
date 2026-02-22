import { QueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError)?.isAxiosError === true;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5分
        retry: (failureCount: number, error: unknown) => {

          // Axios でないエラーはリトライ
          if (!isAxiosError(error)) return failureCount < 3;

          // ネットワークエラー
          if (!error.response) return failureCount < 3;

          // 4xx はリトライなし
          if (error.response.status >= 400 && error.response.status < 500) return false;

          // 5xx は最大3回
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
