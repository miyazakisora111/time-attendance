import type { ClockAction } from '@/domain/attendance/attendance';

/** 勤怠 */
export type AttendanceView = {
    clockAction: ClockAction;
    totalWorkedMs: number | null;
    startTime: string | null;
    endTime: string | null;
    workDate: string;
};

/** 勤怠ステータス */
export interface AttendanceStatusView {
    title: string;
    description: string;
    intent: 'primary' | 'warning' | 'muted';
}

/** 直近打刻 */
export interface LastActionView {
    type: string;
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
