/**
 * 打刻アクション。
 */
export type ClockAction =
    | 'in'
    | 'out'
    | 'break_start'
    | 'break_end';

/**
 * 勤怠状態。
 */
export type AttendanceStatus =
    | 'working'
    | 'out'
    | 'break';

/**
 * ダッシュボード表示用の打刻状態。
 */
export type ClockStatus =
    | 'in'
    | 'out'
    | 'break';

/**
 * 打刻アクション → 勤怠状態の変換マップ。
 */
export const clockActionMap: Record<ClockAction, AttendanceStatus> = {
    in: 'working',
    out: 'out',
    break_start: 'break',
    break_end: 'working',
};