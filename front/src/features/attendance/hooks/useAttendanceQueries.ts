import { useMutation, useQuery, type UseMutationOptions } from '@tanstack/react-query';

import { makeScopedKeys } from '@/lib/query/keys';
import { fetchLatestAttendance, clock } from '@/api/attendance.api';
import type { AttendanceResponse } from '@/__generated__/model/attendanceResponse';
import type { ClockAction } from '@/__generated__/enums';

const SCOPE = 'attendance' as const;
const scoped = makeScopedKeys(SCOPE);
export const attendanceQueryKeys = {
  all: () => scoped.all(),
  latest: () => scoped.nest('latest'),
  clock: () => scoped.nest('clock'),
} as const;

/** 
 * 最新の勤怠情報を取得 
 */
export const useLatestAttendanceQuery = () =>
  useQuery({
    queryKey: attendanceQueryKeys.latest(),
    queryFn: () => fetchLatestAttendance(),
    staleTime: 0, // 打刻直後の refetch を即時実行するため
  });

/**
 * 打刻
 */
export const useClockMutation = (
  options?: UseMutationOptions<AttendanceResponse, Error, ClockAction>,
) => useMutation({
  mutationKey: attendanceQueryKeys.clock(),
  mutationFn: (action: ClockAction) => clock(action),
  ...options,
});