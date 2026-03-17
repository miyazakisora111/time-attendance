import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ClockAction } from '@/domain/time-attendance/clock-action';
import { clockInOut, fetchDashboard } from '@/features/dashboard/api/dashboardApi';
import { API_CONFIG } from '@/config/api';

/**
 * React Query キー。
 */
export const attendanceQueryKeys = {
  all: ['attendance-dashboard'] as const,
  dashboard: () => [...attendanceQueryKeys.all, 'dashboard'] as const,
};

/**
 * 勤怠サマリーを取得する。
 */
export const useAttendanceDashboard = () => {
  return useQuery({
    queryKey: attendanceQueryKeys.dashboard(),
    queryFn: fetchDashboard,
    staleTime: API_CONFIG.cacheStaleTimeMs,
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
export const useAttendanceClockAction = useCreateAttendanceClockAction;
