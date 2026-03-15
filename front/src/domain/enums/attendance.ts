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
 * 直近打刻の表示情報。
 */
export interface LastAction {
  /** 打刻種別ラベル */
  type: string;
  /** 打刻時刻 */
  time: string;
}
