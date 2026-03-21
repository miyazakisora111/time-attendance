import type { TeamMemberStatus } from '@/__generated__/enums';

/**
 * チームメンバー情報。
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: TeamMemberStatus;
  clockInTime: string | null;
}
