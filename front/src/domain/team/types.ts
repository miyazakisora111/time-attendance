/**
 * チームメンバーの勤務状態定数。
 */
export const MEMBER_STATUS = {
  Working: 'working',
  Break: 'break',
  Off: 'off',
  Leave: 'leave',
} as const;

/**
 * チームメンバーの勤務状態。
 */
export type MemberStatus = typeof MEMBER_STATUS[keyof typeof MEMBER_STATUS];

/**
 * チームメンバー情報。
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: MemberStatus;
  clockInTime: string | null;
}
