import type { AttendanceStatus, ClockStatus } from '@/__generated__/enums';

/**
 * 打刻状態 → 勤怠状態
 */
export const clockStatusToAttendanceStatusMap = {
  in: 'working',
  break: 'break',
  out: 'out',
} as const satisfies Record<ClockStatus, AttendanceStatus>;

/**
 * 勤務中かどうかを判定
 */
export const isWorking = (status: ClockStatus): boolean => {
  return status !== "out";
};