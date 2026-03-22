import type { PaidLeaveRequestResponse, OvertimeRequestResponse } from '@/__generated__/model';

/** 有給休暇申請ドメイン型 */
export type PaidLeaveRequestItem = {
    readonly id: string;
    readonly userId: string;
    readonly leaveDate: string;
    readonly days: number;
    readonly status: 'pending' | 'approved' | 'rejected' | 'canceled';
    readonly reason: string | null;
    readonly approvedBy: string | null;
    readonly approvedAt: string | null;
    readonly createdAt: string;
};

/** 残業申請ドメイン型 */
export type OvertimeRequestItem = {
    readonly id: string;
    readonly userId: string;
    readonly workDate: string;
    readonly startTime: string;
    readonly endTime: string;
    readonly status: 'pending' | 'approved' | 'returned' | 'canceled';
    readonly reason: string | null;
    readonly durationHours: number;
    readonly approvedBy: string | null;
    readonly approvedAt: string | null;
    readonly createdAt: string;
};

/** 有給残日数サマリー */
export type PaidLeaveSummary = {
    readonly totalDays: number;
    readonly usedDays: number;
    readonly remainingDays: number;
};

/** 申請一覧ビュー */
export type ApprovalView = {
    readonly paidLeaveRequests: readonly PaidLeaveRequestItem[];
    readonly overtimeRequests: readonly OvertimeRequestItem[];
    readonly pendingPaidLeaveRequests: readonly PaidLeaveRequestItem[];
    readonly pendingOvertimeRequests: readonly OvertimeRequestItem[];
    readonly paidLeaveSummary: PaidLeaveSummary;
    readonly isApprover: boolean;
};

/** 申請タブ種別 */
export type ApprovalTab = 'paid_leave' | 'overtime' | 'pending';
