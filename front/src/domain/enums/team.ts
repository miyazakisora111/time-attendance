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

/**
 * チームメンバー情報。
 */
export interface TeamMember {
  /** メンバーID */
  id: string;
  /** 氏名 */
  name: string;
  /** 役職 */
  role: string;
  /** 所属部署 */
  department: string;
  /** 勤務ステータス */
  status: MemberStatus;
  /** 出勤時刻 */
  clockInTime?: string;
  /** メールアドレス */
  email: string;
  /** アバターURL */
  avatar?: string;
}
