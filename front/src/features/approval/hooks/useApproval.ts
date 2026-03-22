import { useState, useCallback } from 'react';
import { toast as sonner } from 'sonner';
import {
    useApprovalListQuery,
    useCreatePaidLeaveMutation,
    useApprovePaidLeaveMutation,
    useRejectPaidLeaveMutation,
    useCancelPaidLeaveMutation,
    useCreateOvertimeMutation,
    useApproveOvertimeMutation,
    useReturnOvertimeMutation,
    useCancelOvertimeMutation,
} from '@/features/approval/hooks/useApprovalQueries';
import type { ApprovalTab } from '@/domain/approval/types';
import type { CreatePaidLeaveRequest, CreateOvertimeRequest } from '@/__generated__/model';

/**
 * 申請・承認画面の composite hook。
 */
export const useApproval = () => {
    const [activeTab, setActiveTab] = useState<ApprovalTab>('paid_leave');
    const [showPaidLeaveForm, setShowPaidLeaveForm] = useState(false);
    const [showOvertimeForm, setShowOvertimeForm] = useState(false);

    const listQuery = useApprovalListQuery();
    const createPaidLeave = useCreatePaidLeaveMutation();
    const approvePaidLeave = useApprovePaidLeaveMutation();
    const rejectPaidLeave = useRejectPaidLeaveMutation();
    const cancelPaidLeave = useCancelPaidLeaveMutation();
    const createOvertime = useCreateOvertimeMutation();
    const approveOvertime = useApproveOvertimeMutation();
    const returnOvertime = useReturnOvertimeMutation();
    const cancelOvertime = useCancelOvertimeMutation();

    const handleCreatePaidLeave = useCallback((payload: CreatePaidLeaveRequest) => {
        createPaidLeave.mutate(payload, {
            onSuccess: () => {
                sonner.success('有給休暇を申請しました。');
                setShowPaidLeaveForm(false);
            },
            onError: () => sonner.error('申請に失敗しました。'),
        });
    }, [createPaidLeave]);

    const handleApprovePaidLeave = useCallback((id: string) => {
        approvePaidLeave.mutate(id, {
            onSuccess: () => sonner.success('承認しました。'),
            onError: () => sonner.error('承認に失敗しました。'),
        });
    }, [approvePaidLeave]);

    const handleRejectPaidLeave = useCallback((id: string) => {
        rejectPaidLeave.mutate(id, {
            onSuccess: () => sonner.success('却下しました。'),
            onError: () => sonner.error('却下に失敗しました。'),
        });
    }, [rejectPaidLeave]);

    const handleCancelPaidLeave = useCallback((id: string) => {
        cancelPaidLeave.mutate(id, {
            onSuccess: () => sonner.success('キャンセルしました。'),
            onError: () => sonner.error('キャンセルに失敗しました。'),
        });
    }, [cancelPaidLeave]);

    const handleCreateOvertime = useCallback((payload: CreateOvertimeRequest) => {
        createOvertime.mutate(payload, {
            onSuccess: () => {
                sonner.success('残業を申請しました。');
                setShowOvertimeForm(false);
            },
            onError: () => sonner.error('申請に失敗しました。'),
        });
    }, [createOvertime]);

    const handleApproveOvertime = useCallback((id: string) => {
        approveOvertime.mutate(id, {
            onSuccess: () => sonner.success('承認しました。'),
            onError: () => sonner.error('承認に失敗しました。'),
        });
    }, [approveOvertime]);

    const handleReturnOvertime = useCallback((id: string) => {
        returnOvertime.mutate(id, {
            onSuccess: () => sonner.success('差戻ししました。'),
            onError: () => sonner.error('差戻しに失敗しました。'),
        });
    }, [returnOvertime]);

    const handleCancelOvertime = useCallback((id: string) => {
        cancelOvertime.mutate(id, {
            onSuccess: () => sonner.success('キャンセルしました。'),
            onError: () => sonner.error('キャンセルに失敗しました。'),
        });
    }, [cancelOvertime]);

    return {
        isLoading: listQuery.isLoading,
        isError: listQuery.isError,
        hasData: !!listQuery.data,
        activeTab,
        setActiveTab,
        showPaidLeaveForm,
        setShowPaidLeaveForm,
        showOvertimeForm,
        setShowOvertimeForm,
        paidLeaveRequests: listQuery.data?.paidLeaveRequests ?? [],
        overtimeRequests: listQuery.data?.overtimeRequests ?? [],
        pendingPaidLeaveRequests: listQuery.data?.pendingPaidLeaveRequests ?? [],
        pendingOvertimeRequests: listQuery.data?.pendingOvertimeRequests ?? [],
        isApprover: listQuery.data?.isApprover ?? false,
        paidLeaveSummary: listQuery.data?.paidLeaveSummary ?? { totalDays: 0, usedDays: 0, remainingDays: 0 },
        isMutating: createPaidLeave.isPending || createOvertime.isPending,
        handleCreatePaidLeave,
        handleApprovePaidLeave,
        handleRejectPaidLeave,
        handleCancelPaidLeave,
        handleCreateOvertime,
        handleApproveOvertime,
        handleReturnOvertime,
        handleCancelOvertime,
    };
};
