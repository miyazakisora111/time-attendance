import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchTeamMembers } from '@/features/team/api/teamApi';
import type { TeamMember } from '@/domain/team/types';
import { QUERY_CONFIG } from '@/config/api';

/** 部署フィルタの全件選択値。 */
const ALL_DEPARTMENTS = 'すべて';

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
 * チームメンバー一覧を取得 する。
 */
export const useGetTeamMembers = () => {
  return useQuery<TeamMember[]>({
    queryKey: teamQueryKeys.members(),
    queryFn: fetchTeamMembers,
  });
};

/**
 * チーム画面の検索・絞り込み状態を管理する。
 */
export const useTeam = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState(ALL_DEPARTMENTS);

  const teamQuery = useQuery({
    queryKey: teamQueryKeys.members(),
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
      working: members.filter((member) => member.status === 'working').length,
      break: members.filter((member) => member.status === 'break').length,
      leave: members.filter((member) => member.status === 'leave').length,
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
