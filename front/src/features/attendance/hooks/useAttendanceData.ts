import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDashboard, clockIn, clockOut } from '@/features/attendance/api/attendanceApi';
import type {
  AttendanceResponse,
  AttendanceClockInRequest,
  AttendanceClockOutRequest,
} from '@/__generated__/model';
import { API_CONFIG } from '@/config/api';
import { toDashboardView } from '@/features/attendance/adapters/toDashboardView';
import { type DashboardView } from '@/features/attendance/adapters/types';

/**
 * React Query キー。
 */
export const attendanceQueryKeys = {
  all: ['attendance-dashboard'] as const,
  dashboard: () => [...attendanceQueryKeys.all, 'dashboard'] as const,
};

/** 勤怠サマリー取得 */
export const useAttendanceDashboard = () => {
  return useQuery({
    queryKey: attendanceQueryKeys.dashboard(),
    queryFn: async (): Promise<DashboardView> => {
      const res = await fetchDashboard();
      return toDashboardView(res);
    },
    staleTime: API_CONFIG.cacheStaleTimeMs,
  });
};

/** 出勤打刻 */
export const useClockIn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['attendance', 'clockIn'],
    mutationFn: (payload: AttendanceClockInRequest) => clockIn(payload),
    onSuccess: (res: AttendanceResponse) => {
      const view = toDashboardView(res);
      qc.setQueryData(attendanceQueryKeys.dashboard(), view);
      qc.invalidateQueries({ queryKey: attendanceQueryKeys.dashboard() });
    },
  });
};

/** 退勤打刻 */
export const useClockOut = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['attendance', 'clockOut'],
    mutationFn: (payload: AttendanceClockOutRequest) => clockOut(payload),
    onSuccess: (res: AttendanceResponse) => {
      const view = toDashboardView(res);
      qc.setQueryData(attendanceQueryKeys.dashboard(), view);
      qc.invalidateQueries({ queryKey: attendanceQueryKeys.dashboard() });
    },
  });
};