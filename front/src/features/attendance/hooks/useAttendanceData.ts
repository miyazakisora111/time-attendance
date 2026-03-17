import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDashboard, clockIn, clockOut } from '@/features/attendance/api/attendanceApi';
import type {
  AttendanceResponse,
  AttendanceClockInRequest,
  AttendanceClockOutRequest,
} from '@/__generated__/model';
import { API_CONFIG } from '@/config/api';
import { toAttendanceView } from '@/features/attendance/adapters/toAttendanceView';
import { type AttendanceView } from '@/features/attendance/ui/types';

/**
 * React Query キー。
 */
export const attendanceQueryKeys = {
  all: ['attendance'] as const,
  attendance: () => [...attendanceQueryKeys.all, 'attendance'] as const,
};

/** 
 * 勤怠サマリー取得 
 */
export const useAttendanceDashboard = () => {
  return useQuery({
    queryKey: attendanceQueryKeys.attendance(),
    queryFn: async (): Promise<AttendanceView> => {
      const res = await fetchDashboard();
      return toAttendanceView(res);
    },
    staleTime: API_CONFIG.cacheStaleTimeMs,
  });
};

/** 
 * 出勤打刻 
 */
export const useClockIn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['attendance', 'clockIn'],
    mutationFn: (payload: AttendanceClockInRequest) => clockIn(payload),
    onSuccess: (res: AttendanceResponse) => {
      const view = toAttendanceView(res);
      qc.setQueryData(attendanceQueryKeys.attendance(), view);
      qc.invalidateQueries({ queryKey: attendanceQueryKeys.attendance() });
    },
  });
};

/** 
 * 退勤打刻 
 */
export const useClockOut = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['attendance', 'clockOut'],
    mutationFn: (payload: AttendanceClockOutRequest) => clockOut(payload),
    onSuccess: (res: AttendanceResponse) => {
      const view = toAttendanceView(res);
      qc.setQueryData(attendanceQueryKeys.attendance(), view);
      qc.invalidateQueries({ queryKey: attendanceQueryKeys.attendance() });
    },
  });
};