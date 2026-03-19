import type { ClockAction } from '@/domain/attendance/attendance';

/**
 * 打刻アクションの表示用ラベル。
 */
export const clockActionLabelMap: Record<ClockAction, string> = {
    in: '出勤',
    out: '退勤',
    break_start: '休憩開始',
    break_end: '休憩終了',
};

/**
 * 打刻アクションに対応する表示ラベルを返す。
 */
export const getActionLabel = (action: ClockAction): string => {
    return clockActionLabelMap[action];
};

type BadgeIntent = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';

const attendanceRecordStatusIntentMap: Record<string, BadgeIntent> = {
    通常: 'default',
    残業: 'warning',
    休日: 'primary',
};

/**
 * 勤怠記録ステータス文字列に対応するバッジ intent を返す。
 */
export const getAttendanceRecordStatusBadgeIntent = (status: string): BadgeIntent => {
    return attendanceRecordStatusIntentMap[status] ?? 'default';
};