import React from 'react';
import { Container } from '@/shared/components';
import { useApproval } from '@/features/approval/hooks/useApproval';
import { ApprovalPresenter } from '@/features/approval/ui/ApprovalPresenter';

const ApprovalPage: React.FC = () => {
  const {
    activeTab, setActiveTab,
    isModalOpen, setIsModalOpen,
    filteredRequests, handleApprove, handleReject,
    teamPendingCount, searchQuery, setSearchQuery
  } = useApproval();

  return (
    <Container size="full">
      <ApprovalPresenter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        requests={filteredRequests}
        handleApprove={handleApprove}
        handleReject={handleReject}
        teamPendingCount={teamPendingCount}
      />
    </Container>
  );
};

export default ApprovalPage;
