
import type { ClockAction } from '@/features/dashboard/ui/clock/ClockActionButtons';
// ※ ここで UI 型に依存したくない場合は、ClockAction を domain に昇格させる設計もアリ

export const actionLabelMap: Record<ClockAction, string> = {
    in: '出勤',
    out: '退勤',
    break_start: '休憩開始',
    break_end: '休憩終了',
};
