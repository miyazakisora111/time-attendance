/**
 * React Query クライアント設定
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // デフォルトStale時間：5分
      staleTime: 1000 * 60 * 5,
      // デフォルトCache時間：30分
      gcTime: 1000 * 60 * 30,
      // デフォルトリトライ：3回
      retry: 3,
      // リトライ間隔：指数バックオフ
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // ミューテーションのリトライ：1回
      retry: 1,
    },
  },
});
