/**
 * チームメンバーの勤務状態。
 */
export type MemberStatus = 'working' | 'break' | 'leave';

/**
 * チームメンバー情報。
 */
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: MemberStatus;
  clockInTime: string | null;
};
