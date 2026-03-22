import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import {
    fetchApprovalList,
    createPaidLeaveRequest,
    approvePaidLeaveRequest,
    rejectPaidLeaveRequest,
    cancelPaidLeaveRequest,
    createOvertimeRequest,
    approveOvertimeRequest,
    returnOvertimeRequest,
    cancelOvertimeRequest,
} from '@/api/approval.api';
import type {
    ApprovalListResponse,
    CreatePaidLeaveRequest,
    CreateOvertimeRequest,
} from '@/__generated__/model';
import type { ApprovalView } from '@/domain/approval/types';
import { toApprovalView } from '@/features/approval/mappers/toApprovalView';

const SCOPE = 'approval' as const;
const scoped = makeScopedKeys(SCOPE);
export const approvalQueryKeys = {
    all: () => scoped.all(),
    list: () => scoped.nest('list'),
} as const;

/** 申請一覧クエリ */
export const useApprovalListQuery = () =>
    useQuery<ApprovalListResponse, Error, ApprovalView>({
        queryKey: approvalQueryKeys.list(),
        queryFn: fetchApprovalList,
        select: toApprovalView,
    });

/** 有給休暇申請ミューテーション */
export const useCreatePaidLeaveMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreatePaidLeaveRequest) => createPaidLeaveRequest(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: approvalQueryKeys.list() }),
    });
};

/** 有給休暇承認ミューテーション */
export const useApprovePaidLeaveMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => approvePaidLeaveRequest(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: approvalQueryKeys.list() }),
    });
};

/** 有給休暇却下ミューテーション */
export const useRejectPaidLeaveMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => rejectPaidLeaveRequest(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: approvalQueryKeys.list() }),
    });
};

/** 有給休暇キャンセルミューテーション */
export const useCancelPaidLeaveMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => cancelPaidLeaveRequest(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: approvalQueryKeys.list() }),
    });
};

/** 残業申請ミューテーション */
export const useCreateOvertimeMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateOvertimeRequest) => createOvertimeRequest(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: approvalQueryKeys.list() }),
    });
};

/** 残業承認ミューテーション */
export const useApproveOvertimeMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => approveOvertimeRequest(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: approvalQueryKeys.list() }),
    });
};

/** 残業差戻しミューテーション */
export const useReturnOvertimeMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => returnOvertimeRequest(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: approvalQueryKeys.list() }),
    });
};

/** 残業キャンセルミューテーション */
export const useCancelOvertimeMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => cancelOvertimeRequest(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: approvalQueryKeys.list() }),
    });
};
