import type { ClockAction, AttendanceStatus, ClockStatus } from '@/__generated__/enums';

/**
 * 打刻アクション → 勤怠状態
 */
export const actionToAttendanceStatusMap = {
  in: 'working',
  out: 'out',
  breakStart: 'break',
  breakEnd: 'working',
} as const satisfies Record<ClockAction, AttendanceStatus>;

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