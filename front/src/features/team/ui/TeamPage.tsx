import React from 'react';
import { Container } from '@/shared/components';
import { AsyncDataState } from '@/shared/components/states/AsyncDataState';
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
      <AsyncDataState
        isLoading={isLoading}
        isError={isError}
        isEmpty={Array.isArray(filteredMembers) && filteredMembers.length === 0}
      >
        <TeamPresenter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterDept={filterDept}
          setFilterDept={setFilterDept}
          filteredMembers={filteredMembers}
          stats={stats}
          departments={departments}
        />
      </AsyncDataState>
    </Container>
  );
};

export default TeamPage;
