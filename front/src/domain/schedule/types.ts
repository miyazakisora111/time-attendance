/**
 * スケジュール日のステータス定数。
 */
export const DAY_SCHEDULE_STATUS = {
  Working: 'working',
  Off: 'off',
  Holiday: 'holiday',
  Pending: 'pending',
} as const;

/**
 * スケジュール日のステータス型。
 */
export type DayScheduleStatus = typeof DAY_SCHEDULE_STATUS[keyof typeof DAY_SCHEDULE_STATUS];

/**
 * 日次スケジュール。
 */
export interface DaySchedule {
  /** 日付表示 */
  date: string;
  /** 勤務ステータス */
  status: DayScheduleStatus;
  /** シフト名称 */
  shift?: string;
  /** 勤務時間帯 */
  timeRange?: string;
  /** 今日フラグ */
  isToday?: boolean;
}
