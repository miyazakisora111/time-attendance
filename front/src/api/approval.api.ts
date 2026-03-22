import { getApproval } from '@/__generated__/approval/approval';
import type {
    ApprovalListResponse,
    CreatePaidLeaveRequest,
    PaidLeaveRequestResponse,
    CreateOvertimeRequest,
    OvertimeRequestResponse,
} from '@/__generated__/model';
import { call } from '@/lib/http/result';

const client = getApproval();

/** 申請一覧を取得 */
export const fetchApprovalList = () =>
    call<ApprovalListResponse>(() => client.getApprovalListApi());

/** 有給休暇を申請 */
export const createPaidLeaveRequest = (payload: CreatePaidLeaveRequest) =>
    call<PaidLeaveRequestResponse>(() => client.createPaidLeaveRequestApi(payload));

/** 有給休暇申請を承認 */
export const approvePaidLeaveRequest = (id: string) =>
    call<PaidLeaveRequestResponse>(() => client.approvePaidLeaveRequestApi(id));

/** 有給休暇申請を却下 */
export const rejectPaidLeaveRequest = (id: string) =>
    call<PaidLeaveRequestResponse>(() => client.rejectPaidLeaveRequestApi(id));

/** 有給休暇申請をキャンセル */
export const cancelPaidLeaveRequest = (id: string) =>
    call<PaidLeaveRequestResponse>(() => client.cancelPaidLeaveRequestApi(id));

/** 残業を申請 */
export const createOvertimeRequest = (payload: CreateOvertimeRequest) =>
    call<OvertimeRequestResponse>(() => client.createOvertimeRequestApi(payload));

/** 残業申請を承認 */
export const approveOvertimeRequest = (id: string) =>
    call<OvertimeRequestResponse>(() => client.approveOvertimeRequestApi(id));

/** 残業申請を差戻し */
export const returnOvertimeRequest = (id: string) =>
    call<OvertimeRequestResponse>(() => client.returnOvertimeRequestApi(id));

/** 残業申請をキャンセル */
export const cancelOvertimeRequest = (id: string) =>
    call<OvertimeRequestResponse>(() => client.cancelOvertimeRequestApi(id));
