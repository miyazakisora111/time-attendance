import type { ClockAction } from '@/__generated__/enums';

/** 勤怠 */
export type AttendanceView = {
    clockAction: ClockAction;
    totalWorkedMinutes: number | null;
    startTime: string | null;
    endTime: string | null;
    workDate: string;
};

/** 直近打刻 */
export interface LastActionView {
    label: string;
    time: string;
}

/**
 * 直近打刻情報。
 */
export interface LastAction {
    /** 打刻種別 */
    clockAction: ClockAction;
    /** 打刻時刻 */
    time: string;
}
