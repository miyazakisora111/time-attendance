import { getAttendance } from '@/__generated__/attendance/attendance';
import type {
    AttendanceResponse,
    AttendanceClockInBodyBody,
    AttendanceClockOutBodyBody,
    ListAttendances200,
    AttendanceBreakStartBodyBody,
    AttendanceBreakEndBodyBody,
} from '@/__generated__/model';
import { call } from '@/lib/http/result';

const client = getAttendance();

/** 
 * 最新の勤怠情報を取得
 */
export const fetchLatestAttendance = () => call<AttendanceResponse>(() => client.getLatestAttendance());

/** 
 * 出勤打刻
 */
export const clockIn = (payload: AttendanceClockInBodyBody) => call<AttendanceResponse>(() => client.createClockIn(payload));

/** 
 * 退勤打刻
 */
export const clockOut = (payload: AttendanceClockOutBodyBody) => call<AttendanceResponse>(() => client.createClockOut(payload));

/** 
 * 休憩開始 
 */
export const breakStart = (payload: AttendanceBreakStartBodyBody) => call<AttendanceResponse>(() => client.createBreakStart(payload));

/** 
 * 休憩終了
 */
export const breakEnd = (payload: AttendanceBreakEndBodyBody) => call<AttendanceResponse>(() => client.createBreakEnd(payload));

/** 
 * 勤怠一覧取得
 */
export const fetchAttendanceList = (from: string, to: string) => call<ListAttendances200>(() => client.listAttendances({ from, to }));