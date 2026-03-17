import type { ClockStatus } from '@/domain/attendance/attendance';

/** 勤怠 */
export type AttendanceView = {
    clockStatus: ClockStatus;
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

/** 打刻ステータスのバッジ */
export interface ClockStatusBadgeView {
    text: string;
    intent: 'default' | 'success' | 'warning';
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
  ttendanceStatus: AttendanceStatus;
  /** 打刻時刻 */
  time: string;
}
