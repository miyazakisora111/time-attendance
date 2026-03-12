import React from 'react';
import { Container } from '@/shared/components';
import { useTeam } from '@/features/team/hooks/useTeam';
import { TeamPresenter } from '@/features/team/ui/TeamPresenter';

const TeamPage: React.FC = () => {
  const { 
    searchQuery, setSearchQuery, 
    filterDept, setFilterDept, 
    filteredMembers, stats, departments 
  } = useTeam();

  return (
    <Container size="full">
      <TeamPresenter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterDept={filterDept}
        setFilterDept={setFilterDept}
        filteredMembers={filteredMembers}
        stats={stats}
        departments={departments}
      />
    </Container>
  );
};

export default TeamPage;
