import { useQuery } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchTeamMembers } from '@/features/team/api/teamApi';
import { toTeamMembers } from '@/features/team/mappers/toTeamMembers';
import type { TeamMembersResponse } from '@/__generated__/model';
import type { TeamMember } from '@/domain/team/types';

/**
 * React Query キー。
 */
const SCOPE = 'team' as const;
const scoped = makeScopedKeys(SCOPE);
export const teamQueryKeys = {
  all: () => scoped.all(),
  members: () => scoped.nest('members'),
} as const;

/**
 * チームメンバー一覧を取得する。
 */
export const useTeamMembersQuery = () =>
  useQuery<TeamMembersResponse, Error, TeamMember[]>({
    queryKey: teamQueryKeys.members(),
    queryFn: fetchTeamMembers,
    select: toTeamMembers,
  });
