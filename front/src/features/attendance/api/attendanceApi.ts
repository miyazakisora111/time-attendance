import { getAttendance } from '@/__generated__/attendance/attendance';
import type {
    AttendanceResponse,
    AttendanceClockInRequest,
    AttendanceClockOutRequest,
} from '@/__generated__/model';
import { call } from '@/shared/http/result/envelope';

const client = getAttendance();

/** ダッシュボードを取得 */
export const fetchDashboard = () => call<AttendanceResponse>(client.todayAttendanceApi());

/** 出勤打刻 */
export const clockIn = (payload: AttendanceClockInRequest) => call<AttendanceResponse>(client.clockInApi(payload));

/** 退勤打刻 */
export const clockOut = (payload: AttendanceClockOutRequest) => call<AttendanceResponse>(client.clockOutApi(payload));