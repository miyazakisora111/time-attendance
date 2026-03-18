import type { TeamMembersResponse } from '@/__generated__/model';
import type { TeamMember } from '@/domain/team/types';

/**
 * API レスポンスをチームメンバー型に変換する。
 */
export const toTeamMembers = (response: TeamMembersResponse): TeamMember[] =>
  response.members.map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    department: member.department,
    role: member.role,
    status: member.status as TeamMember['status'],
    clockInTime: member.clockInTime ?? null,
  }));
