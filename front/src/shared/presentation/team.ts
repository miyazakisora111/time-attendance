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

export const getTeamMemberStatusView = (status: TeamMemberStatus): TeamMemberStatusView => {
  return teamMemberStatusViewMap[status];
};

// TODO:用整理