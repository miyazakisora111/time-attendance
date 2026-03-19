/**
 * 打刻アクション。
 */
export type ClockAction =
    | 'in'
    | 'out'
    | 'break_start'
    | 'break_end';

/**
 * 勤怠状態。
 */
export type AttendanceStatus =
    | 'working'
    | 'out'
    | 'break';

/**
 * 打刻状態。
 */
export type ClockStatus =
    | 'in'
    | 'out'
    | 'break';


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
