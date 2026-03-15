import React from 'react';
import { Container } from '@/shared/components';
import { DataStateWrapper } from '@/shared/components/DataStateWrapper';
import { useTeam } from '@/features/team/hooks/useTeam';
import { TeamPresenter } from '@/features/team/ui/TeamPresenter';

const TeamPage: React.FC = () => {
  const { 
    isLoading,
    isError,
    searchQuery, setSearchQuery, 
    filterDept, setFilterDept, 
    filteredMembers, stats, departments 
  } = useTeam();

  return (
    <Container size="full">
      <DataStateWrapper isLoading={isLoading} isEmpty={isError} emptyMessage="チーム情報の取得に失敗しました。">
        <TeamPresenter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterDept={filterDept}
          setFilterDept={setFilterDept}
          filteredMembers={filteredMembers}
          stats={stats}
          departments={departments}
        />
      </DataStateWrapper>
    </Container>
  );
};

export default TeamPage;
