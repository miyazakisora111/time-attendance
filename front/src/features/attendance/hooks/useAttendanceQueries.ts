import { useMutation, useQuery, type UseMutationOptions } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchTodayAttendance, clockIn, clockOut } from '@/api/attendance.api';
import { toAttendanceView } from '@/features/attendance/mappers/toAttendanceView';
import type { AttendanceResponse } from '@/__generated__/model/attendanceResponse';
import type { AttendanceClockInRequest } from '@/__generated__/model/attendanceClockInRequest';
import type { AttendanceClockOutRequest } from '@/__generated__/model/attendanceClockOutRequest';

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
export const useTodayAttendanceQuery = () =>
  useQuery({
    queryKey: attendanceQueryKeys.todayAttendance(),
    queryFn: () => fetchTodayAttendance(),
    select: (data) => toAttendanceView(data),
  });

/**
 * 出勤打刻
 */
export const useClockInMutation = (
  options?: UseMutationOptions<AttendanceResponse, Error, AttendanceClockInRequest>,
) => useMutation({
  mutationKey: attendanceQueryKeys.clockIn(),
  mutationFn: (payload: AttendanceClockInRequest) => clockIn(payload),
  ...options,
});

/** 
 * 退勤打刻 
 */
export const useClockOutMutation = (
  options?: UseMutationOptions<AttendanceResponse, Error, AttendanceClockOutRequest>,
) => {
  return useMutation({
    mutationKey: attendanceQueryKeys.clockOut(),
    mutationFn: (payload: AttendanceClockOutRequest) => clockOut(payload),
    ...options,
  });
};