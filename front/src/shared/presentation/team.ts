import type { TeamMemberStatus } from '@/__generated__/enums';

type TeamMemberBadgeIntent = 'default' | 'primary' | 'success' | 'warning';

interface TeamMemberStatusView {
  label: string;
  intent: TeamMemberBadgeIntent;
}

const teamMemberStatusViewMap: Record<TeamMemberStatus, TeamMemberStatusView> = {
  working: { label: '勤務中', intent: 'success' },
  break: { label: '休憩中', intent: 'warning' },
  leave: { label: '休暇', intent: 'primary' },
  off: { label: '未出勤', intent: 'default' },
};

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
  status: TeamMemberStatus;
  /** 出勤時刻 */
  clockInTime?: string;
  /** メールアドレス */
  email: string;
  /** アバターURL */
  avatar?: string;
}

export const getTeamMemberStatusView = (status: TeamMemberStatus): TeamMemberStatusView => {
  return teamMemberStatusViewMap[status];
};