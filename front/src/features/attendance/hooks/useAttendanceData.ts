import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeScopedKeys } from '@/shared/react-query/keys';
import { fetchTodayAttendance, clockIn, clockOut } from '@/features/attendance/api/attendanceApi';
import { API_CONFIG } from '@/config/api';
import { type AttendanceView } from '@/features/attendance/ui/types';

/**
 * React Query キー。
 */
const SCOPE = 'attendance' as const;
const scoped = makeScopedKeys(SCOPE);
export const attendanceQueryKeys = {
  all: () => scoped.all(),
  todayAttendance: () => scoped.nest('todayAttendance'),
  clockIn: () => scoped.nest('clockIn'),
  clockOut: () => scoped.nest('clockOut'),
} as const;

/** 
 * 勤怠取得 
 */
export const useTodayAttendance = () => {
  return useQuery({
    queryKey: attendanceQueryKeys.todayAttendance(),
    queryFn: async (): Promise<AttendanceView> => await fetchTodayAttendance(),
    staleTime: API_CONFIG.cacheStaleTimeMs,
  });
};

/** 
 * 出勤打刻 
 */
export const useClockIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: attendanceQueryKeys.clockIn(),
    mutationFn: (payload: { start_time: string, work_date: string }) => clockIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.all() });
    },
  });
};

/** 
 * 退勤打刻 
 */
export const useClockOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: attendanceQueryKeys.clockOut(),
    mutationFn: (payload: { end_time: string, work_date: string }) => clockOut(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.all() });
    },
  });
};