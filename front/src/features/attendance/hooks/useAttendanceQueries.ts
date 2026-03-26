import { useMutation, useQuery, type UseMutationOptions } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchTodayAttendance, clockIn, clockOut, breakStart, breakEnd } from '@/api/attendance.api';
import { toAttendanceView } from '@/features/attendance/mappers/toAttendanceView';
import type { AttendanceResponse } from '@/__generated__/model/attendanceResponse';
import type { AttendanceClockInRequest } from '@/__generated__/model/attendanceClockInRequest';
import type { AttendanceClockOutRequest } from '@/__generated__/model/attendanceClockOutRequest';
import type { AttendanceBreakStartRequest } from '@/__generated__/model/attendanceBreakStartRequest';
import type { AttendanceBreakEndRequest } from '@/__generated__/model/attendanceBreakEndRequest';

/**
 * React Query キー。
 */
const SCOPE = 'attendance' as const;
const scoped = makeScopedKeys(SCOPE);
export const attendanceQueryKeys = {
  all: () => scoped.all(),
  today: () => scoped.nest('today'),
  clockIn: () => scoped.nest('clockIn'),
  clockOut: () => scoped.nest('clockOut'),
  breakStart: () => scoped.nest('breakStart'),
  breakEnd: () => scoped.nest('breakEnd'),
} as const;

/** 
 * 勤怠取得 
 */
export const useTodayAttendanceQuery = () =>
  useQuery({
    queryKey: attendanceQueryKeys.today(),
    queryFn: () => fetchTodayAttendance(),
    select: (data) => toAttendanceView(data),
    staleTime: 0, // 打刻直後の refetch を即時実行するため
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

/**
 * 休憩開始
 */
export const useBreakStartMutation = (
  options?: UseMutationOptions<AttendanceResponse, Error, AttendanceBreakStartRequest>,
) => useMutation({
  mutationKey: attendanceQueryKeys.breakStart(),
  mutationFn: (payload: AttendanceBreakStartRequest) => breakStart(payload),
  ...options,
});

/**
 * 休憩終了
 */
export const useBreakEndMutation = (
  options?: UseMutationOptions<AttendanceResponse, Error, AttendanceBreakEndRequest>,
) => useMutation({
  mutationKey: attendanceQueryKeys.breakEnd(),
  mutationFn: (payload: AttendanceBreakEndRequest) => breakEnd(payload),
  ...options,
});