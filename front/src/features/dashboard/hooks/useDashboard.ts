import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeScopedKeys } from '@/shared/react-query/keys';
import { fetchDashboard, clockInOut } from '@/features/dashboard/api/dashboardApi';
import type { DashboardResponse } from '@/__generated__/model';
import type { ClockAction } from '@/domain/attendance/attendance';
import { QUERY_CONFIG } from '@/config/api';

/**
 * React Query キー。
 */
const SCOPE = 'dashboard' as const;
const scoped = makeScopedKeys(SCOPE);
export const dashboardQueryKeys = {
  all: () => scoped.all(),
  data: () => scoped.nest('data'),
  stats: () => scoped.nest('stats'),
  recentRecords: () => scoped.nest('recentRecords'),
  clockAction: () => scoped.nest('clockAction'),
} as const;

/**
 * ダッシュボード情報を取得する。
 */
export const useGetDashboard = () => {
  return useQuery<DashboardResponse>({
    queryKey: dashboardQueryKeys.data(),
    queryFn: fetchDashboard,
    staleTime: QUERY_CONFIG.defaultStaleTimeMs,
    refetchOnWindowFocus: false,
  });
};

/**
 * ダッシュボード統計情報を取得する。
 */
export const useGetDashboardStats = () => {
  const query = useGetDashboard();

  return {
    ...query,
    data: query.data?.stats,
  };
};

/**
 * 最近の勤怠記録を取得する。
 */
export const useGetRecentRecords = () => {
  const query = useGetDashboard();

  return {
    ...query,
    data: query.data?.recentRecords,
  };
};

/**
 * 打刻アクションを実行する。
 */
export const useClockInOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: dashboardQueryKeys.clockAction(),
    mutationFn: (action: ClockAction) => clockInOut(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all() });
    },
  });
};

// 互換エクスポート
export const useDashboardData = useGetDashboard;
export const useDashboardStats = useGetDashboardStats;
export const useRecentRecords = useGetRecentRecords;
export const useCreateClockInOut = useClockInOut;
