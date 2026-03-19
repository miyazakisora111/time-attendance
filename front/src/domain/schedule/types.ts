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
 * 月次サマリー。
 */
export interface ScheduleSummary {
  totalWorkHours: number;
  targetHours: number;
  scheduledWorkDays: number;
  overtimeHours: number;
  paidLeaveDays: number;
  remainingPaidLeaveDays: number;
}

/**
 * 日次スケジュール。
 */
export interface DaySchedule {
  /** ISO 日付 */
  isoDate: string;
  /** 日付表示 */
  date: string;
  /** 日本語曜日 */
  dayOfWeek: string;
  /** 勤務ステータス */
  status: DayScheduleStatus;
  /** シフト名称 */
  shift?: string;
  /** 勤務時間帯 */
  timeRange?: string;
  /** 勤務場所 */
  location?: string;
  /** 備考 */
  note?: string;
  /** 今日フラグ */
  isToday: boolean;
  /** 祝日フラグ */
  isHoliday: boolean;
}

/**
 * 月次スケジュール。
 */
export interface ScheduleMonthData {
  year: number;
  month: number;
  summary: ScheduleSummary;
  days: DaySchedule[];
}
