import { getApproval } from '@/__generated__/approval/approval';
import type {
    ApprovalListResponse,
    CreatePaidLeaveRequestBodyBody,
    PaidLeaveRequestResponse,
    CreateOvertimeRequestBodyBody,
    OvertimeRequestResponse,
} from '@/__generated__/model';
import { call } from '@/lib/http/result';

const client = getApproval();

/** 申請一覧を取得 */
export const fetchApprovalList = () =>
    call<ApprovalListResponse>(() => client.listApprovals());

/** 有給休暇を申請 */
export const createPaidLeaveRequest = (payload: CreatePaidLeaveRequestBodyBody) =>
    call<PaidLeaveRequestResponse>(() => client.createPaidLeaveRequest(payload));

/** 有給休暇申請を承認 */
export const approvePaidLeaveRequest = (id: string) =>
    call<PaidLeaveRequestResponse>(() => client.approvePaidLeaveRequest(id));

/** 有給休暇申請を却下 */
export const rejectPaidLeaveRequest = (id: string) =>
    call<PaidLeaveRequestResponse>(() => client.rejectPaidLeaveRequest(id));

/** 有給休暇申請をキャンセル */
export const cancelPaidLeaveRequest = (id: string) =>
    call<PaidLeaveRequestResponse>(() => client.cancelPaidLeaveRequest(id));

/** 残業を申請 */
export const createOvertimeRequest = (payload: CreateOvertimeRequestBodyBody) =>
    call<OvertimeRequestResponse>(() => client.createOvertimeRequest(payload));

/** 残業申請を承認 */
export const approveOvertimeRequest = (id: string) =>
    call<OvertimeRequestResponse>(() => client.approveOvertimeRequest(id));

/** 残業申請を差戻し */
export const returnOvertimeRequest = (id: string) =>
    call<OvertimeRequestResponse>(() => client.returnOvertimeRequest(id));

/** 残業申請をキャンセル */
export const cancelOvertimeRequest = (id: string) =>
    call<OvertimeRequestResponse>(() => client.cancelOvertimeRequest(id));
