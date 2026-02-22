/**
 * React Query 設定
 * Server State 管理の中核
 * 
 * 設計方針:
 * - staleTime: データが fresh である期間
 * - gcTime (旧 cacheTime): メモリ保持期間
 * - retry: 失敗時の再試行
 * - 戦略: フィーチャーごとに細かく設定
 */

import { QueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 🔹 基本設定
        // データが新しい状態が保持される期間
        staleTime: 1000 * 60 * 5, // 5分

        // ガベージコレクション前のメモリ保持期間
        gcTime: 1000 * 60 * 30, // 30分

        // ネットワークエラー時の自動リトライ
        retry: (failureCount, error: AxiosError) => {
          // ネットワークエラー: リトライ
          if (!error.response) return failureCount < 3;
          // 4xx (クライアントエラー): リトライしない
          if (error.response.status >= 400 && error.response.status < 500) {
            return false;
          }
          // 5xx (サーバーエラー): 最大3回リトライ
          return failureCount < 3;
        },

        // リトライ間隔（指数バックオフ）
        retryDelay: (attemptIndex) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),

        // ウィンドウが背景にある間はリフェッチしない
        refetchOnWindowFocus: false,

        // ネットワーク再接続時はリフェッチする
        refetchOnReconnect: true,

        // コンポーネントマウント時のリフェッチ挙動
        refetchOnMount: false,
      },

      mutations: {
        // ミューテーション: リトライはしない（明確な失敗）
        retry: 0,
      },
    },
  });
}

/**
 * Query Key Factory
 * 一元管理により cyclic refetch を防止
 * 
 * 使用例:
 * ```
 * queryKeys.auth.me()
 * → ['auth', 'me']
 *
 * queryKeys.attendance.list({ userId: '123' })
 * → ['attendance', 'list', { userId: '123' }]
 *
 * queryKeys.attendance.list()._def
 * → queryKey を invalidate する時の親キー
 * ```
 */

const createQueryKeys = () => {
  return {
    // 認証
    auth: {
      all: () => ['auth'] as const,
      me: () => [...createQueryKeys().auth.all(), 'me'] as const,
    },

    // 勤怠
    attendance: {
      all: () => ['attendance'] as const,
      list: (filters?: { userId?: string; startDate?: string; endDate?: string }) =>
        [...createQueryKeys().attendance.all(), 'list', filters] as const,
      detail: (id: string) =>
        [...createQueryKeys().attendance.all(), 'detail', id] as const,
    },

    // ユーザー
    users: {
      all: () => ['users'] as const,
      list: (filters?: { departmentId?: string; status?: string }) =>
        [...createQueryKeys().users.all(), 'list', filters] as const,
      detail: (id: string) =>
        [...createQueryKeys().users.all(), 'detail', id] as const,
    },

    // ログイン履歴
    loginHistory: {
      all: () => ['loginHistory'] as const,
      list: (userId: string) =>
        [...createQueryKeys().loginHistory.all(), 'list', userId] as const,
    },

    // ダッシュボード
    dashboard: {
      all: () => ['dashboard'] as const,
      stats: () =>
        [...createQueryKeys().dashboard.all(), 'stats'] as const,
    },
  };
};

export const queryKeys = createQueryKeys();

/**
 * Invalidation パターン集
 */
export const invalidatePatterns = {
  // 認証系を全削除
  invalidateAuth: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() });
  },

  // 勤怠データ全削除
  invalidateAttendance: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.attendance.all(),
    });
  },

  // ユーザーデータ全削除
  invalidateUsers: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
  },

  // ダッシュボード全削除
  invalidateDashboard: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.all(),
    });
  },
};
