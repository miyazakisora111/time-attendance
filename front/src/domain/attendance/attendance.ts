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
 * 打刻アクション → 勤怠状態の変換マップ。
 */
export const clockActionMap: Record<ClockAction, AttendanceStatus> = {
    in: 'working',
    out: 'out',
    break_start: 'break',
    break_end: 'working',
};

/**
 * 打刻アクションの表示用ラベル。
 */
export const clockActionLabelMap: Record<ClockAction, string> = {
    in: '出勤',
    out: '退勤',
    break_start: '休憩開始',
    break_end: '休憩終了',
};