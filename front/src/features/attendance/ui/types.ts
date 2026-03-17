// src/features/attendance/ui/types.ts
import type { AttendanceStatus } from '@/domain/time-attendance/attendance';

/** カードの見た目意図（色/トーン） */
export type AttendanceCardIntent = 'primary' | 'warning' | 'muted';

/** ステータスバッジの見た目意図 */
export type ClockStatusBadgeIntent = 'default' | 'success' | 'warning';

/** 勤怠レコードのバッジ意図 */
export type AttendanceRecordBadgeIntent = 'default' | 'success' | 'warning';

/** 勤怠ステータスの UI 表現 */
export interface AttendanceStatusView {
    title: string;
    description: string;
    intent: AttendanceCardIntent;
}

/** 打刻ステータスのバッジ表現 */
export interface ClockStatusBadgeView {
    text: string;
    intent: ClockStatusBadgeIntent;
}

/** 直近打刻の UI 表現 */
export interface LastActionView {
    type: string; // ラベル（例：出勤/退勤/休憩/戻り）
    time: string; // 表示時刻（例：09:30）
}

/** Presenter の props（必要ならこちらで型も管理） */
export interface AttendancePresenterProps {
    status: AttendanceStatus;
    currentTime: Date;
    lastAction: LastActionView | null;
    isLoading?: boolean;
    isError?: boolean;
    isPending?: boolean;
    todayWorkedTime?: string;
    breakTime?: string;
    onAction: (action: 'in' | 'out' | 'break_start' | 'break_end') => void;
}
