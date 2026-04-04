import type { ClockAction, ClockStatus } from '@/__generated__/enums';

/** 勤怠 */
export type AttendanceView = {
    clockStatus: ClockStatus;
    totalWorkedMinutes: number | null;
    breakMinutes: number | null;
    clockInAt: string | null;
    clockOutAt: string | null;
    workDate: string;
};

/**
 * 直近打刻情報。
 */
export interface LastAction {
    /** 打刻種別 */
    clockAction: ClockAction;
    /** 打刻時刻 */
    time: string;
}
