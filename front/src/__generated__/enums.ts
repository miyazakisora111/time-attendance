/**
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/*.yaml
 */

/* eslint-disable */
/* prettier-ignore */

/**
 * 勤怠レコードの勤務区分
 * @source openapi/components/enums/AttendanceStatus.yaml
 */
export const AttendanceStatus = {
  Working: 'working' as const,
  Out: 'out' as const,
  Break: 'break' as const,
} as const;
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];
export const AttendanceStatusValues = ['working', 'out', 'break'] as const;


/**
 * カレンダー日付の勤務状態
 * @source openapi/components/enums/CalendarDayStatus.yaml
 */
export const CalendarDayStatus = {
  Working: 'working' as const,
  Off: 'off' as const,
  Holiday: 'holiday' as const,
  Pending: 'pending' as const,
} as const;
export type CalendarDayStatus = (typeof CalendarDayStatus)[keyof typeof CalendarDayStatus];
export const CalendarDayStatusValues = ['working', 'off', 'holiday', 'pending'] as const;


/**
 * 打刻アクション種別
 * @source openapi/components/enums/ClockAction.yaml
 */
export const ClockAction = {
  In: 'in' as const,
  Out: 'out' as const,
  BreakStart: 'break_start' as const,
  BreakEnd: 'break_end' as const,
} as const;
export type ClockAction = (typeof ClockAction)[keyof typeof ClockAction];
export const ClockActionValues = ['in', 'out', 'break_start', 'break_end'] as const;


/**
 * 現在の打刻状態
 * @source openapi/components/enums/ClockStatus.yaml
 */
export const ClockStatus = {
  Out: 'out' as const,
  In: 'in' as const,
  Break: 'break' as const,
} as const;
export type ClockStatus = (typeof ClockStatus)[keyof typeof ClockStatus];
export const ClockStatusValues = ['out', 'in', 'break'] as const;


/**
 * 表示言語コード
 * @source openapi/components/enums/LanguageCode.yaml
 */
export const LanguageCode = {
  Ja: 'ja' as const,
  En: 'en' as const,
} as const;
export type LanguageCode = (typeof LanguageCode)[keyof typeof LanguageCode];
export const LanguageCodeValues = ['ja', 'en'] as const;


/**
 * チームメンバーの勤務状態
 * @source openapi/components/enums/TeamMemberStatus.yaml
 */
export const TeamMemberStatus = {
  Working: 'working' as const,
  Break: 'break' as const,
  Off: 'off' as const,
  Leave: 'leave' as const,
} as const;
export type TeamMemberStatus = (typeof TeamMemberStatus)[keyof typeof TeamMemberStatus];
export const TeamMemberStatusValues = ['working', 'break', 'off', 'leave'] as const;


/**
 * UIテーマ設定
 * @source openapi/components/enums/ThemeType.yaml
 */
export const ThemeType = {
  Light: 'light' as const,
  Dark: 'dark' as const,
} as const;
export type ThemeType = (typeof ThemeType)[keyof typeof ThemeType];
export const ThemeTypeValues = ['light', 'dark'] as const;


/**
 * ユーザーアカウントの状態
 * @source openapi/components/enums/UserStatus.yaml
 */
export const UserStatus = {
  Active: 'active' as const,
  Inactive: 'inactive' as const,
  Suspended: 'suspended' as const,
  Deleted: 'deleted' as const,
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export const UserStatusValues = ['active', 'inactive', 'suspended', 'deleted'] as const;
