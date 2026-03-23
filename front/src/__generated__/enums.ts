/**
 * ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY.
 * Re-run: make openapi-enums
 * Source: openapi/components/enums/*.yaml
 */

/* eslint-disable */
/* prettier-ignore */

/**
 * 申請のステータス
 * @source openapi/components/enums/ApprovalStatus.yaml
 */
export const ApprovalStatus = [
    'pending',
  'approved',
  'rejected',
  'canceled',
] as const;
export type ApprovalStatus = (typeof ApprovalStatus)[number];


/**
 * 勤怠レコードの勤務区分
 * @source openapi/components/enums/AttendanceStatus.yaml
 */
export const AttendanceStatus = [
    'working',
  'out',
  'break',
] as const;
export type AttendanceStatus = (typeof AttendanceStatus)[number];


/**
 * カレンダー日付の勤務状態
 * @source openapi/components/enums/CalendarDayStatus.yaml
 */
export const CalendarDayStatus = [
    'working',
  'off',
  'holiday',
  'pending',
] as const;
export type CalendarDayStatus = (typeof CalendarDayStatus)[number];


/**
 * 打刻アクション種別
 * @source openapi/components/enums/ClockAction.yaml
 */
export const ClockAction = [
    'in',
  'out',
  'breakStart',
  'breakEnd',
] as const;
export type ClockAction = (typeof ClockAction)[number];


/**
 * 現在の打刻状態
 * @source openapi/components/enums/ClockStatus.yaml
 */
export const ClockStatus = [
    'out',
  'in',
  'break',
] as const;
export type ClockStatus = (typeof ClockStatus)[number];


/**
 * 表示言語コード
 * @source openapi/components/enums/LanguageCode.yaml
 */
export const LanguageCode = [
    'ja',
  'en',
] as const;
export type LanguageCode = (typeof LanguageCode)[number];


/**
 * 残業申請のステータス
 * @source openapi/components/enums/OvertimeRequestStatus.yaml
 */
export const OvertimeRequestStatus = [
    'pending',
  'approved',
  'returned',
  'canceled',
] as const;
export type OvertimeRequestStatus = (typeof OvertimeRequestStatus)[number];


/**
 * チームメンバーの勤務状態
 * @source openapi/components/enums/TeamMemberStatus.yaml
 */
export const TeamMemberStatus = [
    'working',
  'break',
  'off',
  'leave',
] as const;
export type TeamMemberStatus = (typeof TeamMemberStatus)[number];


/**
 * UIテーマ設定
 * @source openapi/components/enums/ThemeType.yaml
 */
export const ThemeType = [
    'light',
  'dark',
] as const;
export type ThemeType = (typeof ThemeType)[number];


/**
 * ユーザーアカウントの状態
 * @source openapi/components/enums/UserStatus.yaml
 */
export const UserStatus = [
    'active',
  'inactive',
] as const;
export type UserStatus = (typeof UserStatus)[number];
