import { getAttendance } from '@/__generated__/attendance/attendance';
import type {
    AttendanceResponse,
    AttendanceClockInRequest,
    AttendanceClockOutRequest,
} from '@/__generated__/model';
import { call } from '@/lib/http/result';
import { customInstance } from '@/lib/http/client';

const client = getAttendance();

/** 勤怠を取得 */
export const fetchTodayAttendance = () => call<AttendanceResponse>(() => client.todayAttendanceApi());

/** 出勤打刻 */
export const clockIn = (payload: AttendanceClockInRequest) => call<AttendanceResponse>(() => client.clockInApi(payload));

/** 退勤打刻 */
export const clockOut = (payload: AttendanceClockOutRequest) => call<AttendanceResponse>(() => client.clockOutApi(payload));

/** 休憩開始 */
export const breakStart = () =>
    customInstance<AttendanceResponse>({ url: '/api/attendances/break-start', method: 'POST' });

/** 休憩終了 */
export const breakEnd = () =>
    customInstance<AttendanceResponse>({ url: '/api/attendances/break-end', method: 'POST' });