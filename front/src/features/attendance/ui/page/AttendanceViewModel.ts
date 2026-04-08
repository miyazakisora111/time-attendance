import type { ClockStatus } from '@/__generated__/enums';

/**
 * 勤怠画面用 ViewModel
 */
export type AttendanceView = {
    clockStatus: ClockStatus;
    totalWorkedMinutes: number;
    breakMinutes: number;
    overtimeMinutes: number;
    clockInAt: string | null;
    clockOutAt: string | null;
    workDate: string;
};

/**
 * AttendanceView のデフォルト値
 */
export const attendanceViewDefaults: AttendanceView = {
    clockStatus: 'out',
    totalWorkedMinutes: 0,
    breakMinutes: 0,
    overtimeMinutes: 0,
    clockInAt: null,
    clockOutAt: null,
    workDate: '',
};

/**
 * データが存在しないときの View を生成
 */
export const createEmptyAttendanceView = (): AttendanceView => ({
    ...attendanceViewDefaults,
});
