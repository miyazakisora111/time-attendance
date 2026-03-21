import type { ClockAction, AttendanceStatus, ClockStatus } from '@/__generated__/enums';

/**
 * 打刻アクション → 勤怠状態
 */
export const actionToAttendanceStatusMap = {
  in: 'working',
  out: 'out',
  break_start: 'break',
  break_end: 'working',
} as const satisfies Record<ClockAction, AttendanceStatus>;

/**
 * 打刻アクション → 打刻状態
 */
export const actionToClockStatusMap = {
  in: 'in',
  out: 'out',
  break_start: 'break',
  break_end: 'in',
} as const satisfies Record<ClockAction, ClockStatus>;

/**
 * 打刻状態 → 勤怠状態
 */
export const clockStatusToAttendanceStatusMap = {
  in: 'working',
  break: 'break',
  out: 'out',
} as const satisfies Record<ClockStatus, AttendanceStatus>;

/**
 * 打刻アクションを取得
 */
export const resolveClockAction = (
  start?: string | null,
  end?: string | null,
): ClockAction => start && !end ? "in" : "out";

/**
 * 勤務中かどうかを判定
 */
export const isWorking = (status: ClockStatus): boolean => {
  return status !== "out";
};