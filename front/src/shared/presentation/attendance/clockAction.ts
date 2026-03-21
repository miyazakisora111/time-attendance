import type { ClockAction } from '@/__generated__/enums';
import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '@/shared/design-system/variants/badge';

type BadgeIntent = NonNullable<VariantProps<typeof badgeVariants>['intent']>;

const clockActionLabelMap: Record<ClockAction, string> = {
    in: '出勤',
    out: '退勤',
    break_start: '休憩開始',
    break_end: '休憩終了',
};

/**
 * 打刻アクションに対応する表示ラベルを返す。
 */
export const getClockActionLabel = (action: ClockAction): string => {
    return clockActionLabelMap[action];
};

/**
 * 勤怠記録ステータスに対応するバッジ intent を返す。
 */
export const getAttendanceStatusBadgeIntent = (status: string): BadgeIntent => {
    const map: Record<string, BadgeIntent> = {
        '通常': 'default',
        '残業': 'warning',
        '休日': 'outline',
    };
    return map[status] ?? 'default';
};