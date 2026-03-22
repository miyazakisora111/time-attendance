import type { ApprovalListResponse } from '@/__generated__/model';
import type { ApprovalView, PaidLeaveRequestItem, OvertimeRequestItem } from '@/domain/approval/types';
import type { Mapper } from '@/shared/mapper/types';

const mapPaidLeave = (r: ApprovalListResponse['paidLeaveRequests'][number]): PaidLeaveRequestItem => ({
    id: r.id,
    userId: r.userId,
    leaveDate: r.leaveDate,
    days: r.days,
    status: r.status,
    reason: r.reason ?? null,
    approvedBy: r.approvedBy ?? null,
    approvedAt: r.approvedAt ?? null,
    createdAt: r.createdAt,
});

const mapOvertime = (r: ApprovalListResponse['overtimeRequests'][number]): OvertimeRequestItem => ({
    id: r.id,
    userId: r.userId,
    workDate: r.workDate,
    startTime: r.startTime,
    endTime: r.endTime,
    status: r.status,
    reason: r.reason ?? null,
    durationHours: r.durationHours,
    approvedBy: r.approvedBy ?? null,
    approvedAt: r.approvedAt ?? null,
    createdAt: r.createdAt,
});

export const toApprovalView: Mapper<ApprovalListResponse, ApprovalView> = (response) => ({
    paidLeaveRequests: response.paidLeaveRequests.map(mapPaidLeave),
    overtimeRequests: response.overtimeRequests.map(mapOvertime),
    pendingPaidLeaveRequests: response.pendingPaidLeaveRequests.map(mapPaidLeave),
    pendingOvertimeRequests: response.pendingOvertimeRequests.map(mapOvertime),
    paidLeaveSummary: {
        totalDays: response.paidLeaveSummary.totalDays,
        usedDays: response.paidLeaveSummary.usedDays,
        remainingDays: response.paidLeaveSummary.remainingDays,
    },
    isApprover: response.isApprover,
});
