import type { MemberStatus } from '@/domain/enums/team';

type TeamMemberBadgeIntent = 'default' | 'primary' | 'success' | 'warning';

interface TeamMemberStatusView {
  label: string;
  intent: TeamMemberBadgeIntent;
}

const teamMemberStatusViewMap: Record<MemberStatus, TeamMemberStatusView> = {
  working: { label: '勤務中', intent: 'success' },
  break: { label: '休憩中', intent: 'warning' },
  leave: { label: '休暇', intent: 'primary' },
  off: { label: '未出勤', intent: 'default' },
};

export const getTeamMemberStatusView = (status: MemberStatus): TeamMemberStatusView => {
  return teamMemberStatusViewMap[status];
};