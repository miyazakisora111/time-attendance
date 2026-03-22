import React from 'react';
import { Container } from '@/shared/components';
import { AsyncDataState } from '@/shared/components/states/AsyncDataState';
import { useApproval } from '@/features/approval/hooks/useApproval';
import { ApprovalPresenter } from '@/features/approval/ui/ApprovalPresenter';

const ApprovalPage: React.FC = () => {
    const {
        isLoading, isError, hasData,
        activeTab, setActiveTab,
        showPaidLeaveForm, setShowPaidLeaveForm,
        showOvertimeForm, setShowOvertimeForm,
        paidLeaveRequests, overtimeRequests, paidLeaveSummary,
        pendingPaidLeaveRequests, pendingOvertimeRequests, isApprover,
        isMutating,
        handleCreatePaidLeave, handleApprovePaidLeave, handleRejectPaidLeave, handleCancelPaidLeave,
        handleCreateOvertime, handleApproveOvertime, handleReturnOvertime, handleCancelOvertime,
    } = useApproval();

    return (
        <Container size="full">
            <AsyncDataState isLoading={isLoading} isError={isError} isEmpty={!hasData}>
                <ApprovalPresenter
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    paidLeaveRequests={paidLeaveRequests}
                    overtimeRequests={overtimeRequests}
                    pendingPaidLeaveRequests={pendingPaidLeaveRequests}
                    pendingOvertimeRequests={pendingOvertimeRequests}
                    isApprover={isApprover}
                    paidLeaveSummary={paidLeaveSummary}
                    showPaidLeaveForm={showPaidLeaveForm}
                    setShowPaidLeaveForm={setShowPaidLeaveForm}
                    showOvertimeForm={showOvertimeForm}
                    setShowOvertimeForm={setShowOvertimeForm}
                    isMutating={isMutating}
                    onCreatePaidLeave={handleCreatePaidLeave}
                    onApprovePaidLeave={handleApprovePaidLeave}
                    onRejectPaidLeave={handleRejectPaidLeave}
                    onCancelPaidLeave={handleCancelPaidLeave}
                    onCreateOvertime={handleCreateOvertime}
                    onApproveOvertime={handleApproveOvertime}
                    onReturnOvertime={handleReturnOvertime}
                    onCancelOvertime={handleCancelOvertime}
                />
            </AsyncDataState>
        </Container>
    );
};

export default ApprovalPage;
