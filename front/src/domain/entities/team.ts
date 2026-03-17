/**
 * チームメンバーの勤務ステータス定数。
 */
export const MEMBER_STATUS = {
  Working: 'working',
  Break: 'break',
  Off: 'off',
  Leave: 'leave',
} as const;

/**
 * チームメンバー勤務ステータス型。
 */
export type MemberStatus = typeof MEMBER_STATUS[keyof typeof MEMBER_STATUS];
