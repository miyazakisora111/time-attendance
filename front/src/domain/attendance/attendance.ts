/**
 * 打刻アクション。
 */
export type ClockAction =
    | 'in'
    | 'out'
    | 'break_start'
    | 'break_end';

/**
 * 打刻アクションの表示用ラベル。
 */
export const actionLabelMap: Record<ClockAction, string> = {
    in: '出勤',
    out: '退勤',
    break_start: '休憩開始',
    break_end: '休憩終了',
};

/**
 * 勤怠状態。
 */
export type AttendanceStatus =
    | 'in'
    | 'out'
    | 'break';