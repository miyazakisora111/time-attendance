import type { ClockAction } from '@/domain/time-attendance/clock-action';

export const actionLabelMap: Record<ClockAction, string> = {
    in: '出勤',
    out: '退勤',
    break_start: '休憩開始',
    break_end: '休憩終了',
};

export const getActionLabel = (action: ClockAction): string => {
    return actionLabelMap[action];
};
