import { useMemo, useState } from 'react';
import { useTeamMembersQuery } from '@/features/team/hooks/useTeamQueries';

/** 部署フィルタの全件選択値。 */
const ALL_DEPARTMENTS = 'すべて';

/**
 * チーム画面の検索・絞り込み状態を管理する。
 */
export const useTeam = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState(ALL_DEPARTMENTS);

  const { data, isLoading, isError } = useTeamMembersQuery();

  const members = useMemo(() => data ?? [], [data]);

  const filteredMembers = useMemo(
    () => members.filter((member) => {
      const matchesSearch = member.name.includes(searchQuery) || member.department.includes(searchQuery);
      const matchesDept = filterDept === ALL_DEPARTMENTS || member.department === filterDept;
      return matchesSearch && matchesDept;
    }),
    [members, searchQuery, filterDept],
  );

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
    isLoading,
    isError,
    searchQuery,
    setSearchQuery,
    filterDept,
    setFilterDept,
    filteredMembers,
    stats,
    departments,
  };
};
