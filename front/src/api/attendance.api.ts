import { getAttendance } from '@/__generated__/attendance/attendance';
import type {
    AttendanceResponse,
    AttendanceClockInBodyBody,
    AttendanceClockOutBodyBody,
    ListAttendances200,
} from '@/__generated__/model';
import { call } from '@/lib/http/result';
import { customInstance } from '@/lib/http/client';

const client = getAttendance();

/** 勤怠を取得 */
export const fetchTodayAttendance = () => call<AttendanceResponse>(() => client.getTodayAttendance());

/** 出勤打刻 */
export const clockIn = (payload: AttendanceClockInBodyBody) => call<AttendanceResponse>(() => client.createClockIn(payload));

/** 退勤打刻 */
export const clockOut = (payload: AttendanceClockOutBodyBody) => call<AttendanceResponse>(() => client.createClockOut(payload));

/** 休憩開始 */
export const breakStart = () =>
    call<AttendanceResponse>(() => customInstance<AttendanceResponse>({ url: '/attendances/break-start', method: 'POST' }));

/** 休憩終了 */
export const breakEnd = () =>
    call<AttendanceResponse>(() => customInstance<AttendanceResponse>({ url: '/attendances/break-end', method: 'POST' }));

/** 勤怠一覧取得 */
export const fetchAttendanceList = (from: string, to: string) =>
    call<ListAttendances200>(() => client.listAttendances({ from, to }));