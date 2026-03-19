import { getAttendance } from '@/__generated__/attendance/attendance';
import type {
    AttendanceResponse,
    AttendanceClockInRequest,
    AttendanceClockOutRequest,
} from '@/__generated__/model';
import { call } from '@/shared/http/result';
import { toAttendanceView } from '@/features/attendance/adapters/toAttendanceView';

const client = getAttendance();

/** 勤怠を取得 */
export const fetchTodayAttendance = () => call<AttendanceResponse>(() => client.todayAttendanceApi()).then(toAttendanceView);

/** 出勤打刻 */
export const clockIn = (payload: AttendanceClockInRequest) => call<AttendanceResponse>(() => client.clockInApi(payload));

/** 退勤打刻 */
export const clockOut = (payload: AttendanceClockOutRequest) => call<AttendanceResponse>(() => client.clockOutApi(payload));