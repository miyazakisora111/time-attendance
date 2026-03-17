import type { ClockAction } from './clock-action';

/**
 * 打刻状態定数。
 */
export const CLOCK_STATUS = {
  Out: 'out',
  In: 'in',
  Break: 'break',
} as const;

/**
 * 打刻状態型。
 */
export type ClockStatus = typeof CLOCK_STATUS[keyof typeof CLOCK_STATUS];

/**
 * 勤怠ステータス定数。
 */
export const ATTENDANCE_STATUS = {
  Out: 'out',
  Working: 'working',
  Break: 'break',
} as const;

/**
 * 勤怠ステータス型。
 */
export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];

/**
 * 直近打刻情報。
 */
export interface LastAction {
  /** 打刻種別 */
  action: ClockAction;
  /** 打刻時刻 */
  time: string;
}