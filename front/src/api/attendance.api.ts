import { getAttendance } from '@/__generated__/attendance/attendance';
import type {
    AttendanceResponse,
    ListAttendances200,
} from '@/__generated__/model';
import type { ClockAction } from '@/__generated__/enums';
import { call } from '@/lib/http/result';

const client = getAttendance();

/** 
 * 最新の勤怠情報を取得
 */
export const fetchLatestAttendance = () => call<AttendanceResponse>(() => client.getLatestAttendance());

/** 
 * 打刻
 */
export const clock = (action: ClockAction) => call<AttendanceResponse>(() => client.createClock({ action }));

/** 
 * 勤怠一覧取得
 */
export const fetchAttendanceList = (from: string, to: string) => call<ListAttendances200>(() => client.listAttendances({ from, to }));