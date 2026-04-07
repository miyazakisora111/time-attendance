import type { ClockAction } from '@/__generated__/enums';

/** 打刻アクション → 表示ラベル */
const CLOCK_ACTION_LABEL_MAP: Record<ClockAction, string> = {
    in: '出勤',
    out: '退勤',
    breakStart: '休憩開始',
    breakEnd: '休憩終了',
};

/** 打刻アクションに対応する表示ラベルを返す */
export const getClockActionLabel = (action: ClockAction): string => {
    return CLOCK_ACTION_LABEL_MAP[action];
};