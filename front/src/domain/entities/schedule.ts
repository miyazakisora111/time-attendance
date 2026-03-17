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