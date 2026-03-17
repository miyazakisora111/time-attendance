import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeam } from '@/__generated__/team/team';
import type { TeamMember as ApiTeamMember } from '@/__generated__/model';
import { MEMBER_STATUS, type MemberStatus, type TeamMember } from '@/domain/entities/team';
import { unwrapApiEnvelope } from '@/shared/http/unwrapApiEnvelope';

/** 部署フィルタの全件選択値。 */
const ALL_DEPARTMENTS = 'すべて';

/** Team API の Query Key。 */
const TEAM_QUERY_KEY = ['team', 'members'] as const;

/**
 * APIメンバー型をフロント表示型へ正規化する。
 */
const toTeamMember = (member: ApiTeamMember): TeamMember => ({
  id: member.id,
  name: member.name,
  role: member.role,
  department: member.department,
  status: member.status as MemberStatus,
  clockInTime: member.clockInTime ?? undefined,
  email: member.email,
});

/**
 * Team API からメンバー一覧を取得する。
 */
const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await getTeam().getTeamMembersApi();
  const data = unwrapApiEnvelope<{ members: ApiTeamMember[] }>(response);

  return data.members.map(toTeamMember);
};

/**
 * チーム画面の検索・絞り込み状態を管理する。
 */
export const useTeam = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState(ALL_DEPARTMENTS);

  const teamQuery = useQuery({
    queryKey: TEAM_QUERY_KEY,
    queryFn: fetchTeamMembers,
  });

  const members = useMemo(() => teamQuery.data ?? [], [teamQuery.data]);

  const filteredMembers = useMemo(
    () => members.filter((member) => {
      // 名前と部署の部分一致で検索し、部署フィルタを同時に適用する。
      const matchesSearch = member.name.includes(searchQuery) || member.department.includes(searchQuery);
      const matchesDept = filterDept === ALL_DEPARTMENTS || member.department === filterDept;
      return matchesSearch && matchesDept;
    }),
    [members, searchQuery, filterDept],
  );

  // 勤務状態ごとの件数を集計する。
  const stats = useMemo(
    () => ({
      total: members.length,
      working: members.filter((member) => member.status === MEMBER_STATUS.Working).length,
      break: members.filter((member) => member.status === MEMBER_STATUS.Break).length,
      leave: members.filter((member) => member.status === MEMBER_STATUS.Leave).length,
    }),
    [members],
  );

  const departments = useMemo(
    () => [ALL_DEPARTMENTS, ...Array.from(new Set(members.map((member) => member.department)))],
    [members],
  );

  return {
    isLoading: teamQuery.isLoading,
    isError: teamQuery.isError,
    searchQuery,
    setSearchQuery,
    filterDept,
    setFilterDept,
    filteredMembers,
    stats,
    departments,
  };
};
