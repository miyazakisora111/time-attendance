import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clockInOut, fetchDashboard } from '@/features/dashboard/api/dashboardApi';
import type { ClockAction } from '@/features/dashboard/api/dashboardApi';
import { apiConfig } from '@/config/api';

/**
 * 勤怠/ダッシュボードの共通 React Query キー。
 */
export const attendanceQueryKeys = {
  all: ['attendance-dashboard'] as const,
  dashboard: () => [...attendanceQueryKeys.all, 'dashboard'] as const,
};

/**
 * 勤怠/ダッシュボード共通の勤怠サマリーを取得する。
 */
export const useGetAttendanceDashboard = () => {
  return useQuery({
    queryKey: attendanceQueryKeys.dashboard(),
    queryFn: fetchDashboard,
    staleTime: apiConfig.cacheStaleTimeMs,
  });
};

/**
 * 打刻アクションを作成する。
 */
export const useCreateAttendanceClockAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: ClockAction) => clockInOut(action),
    onSuccess: (result) => {
      queryClient.setQueryData(attendanceQueryKeys.dashboard(), result.dashboard);
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.all });
    },
  });
};

// 互換エクスポート
export const useAttendanceDashboardData = useGetAttendanceDashboard;
export const useAttendanceClockAction = useCreateAttendanceClockAction;
