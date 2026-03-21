import type { ClockStatus } from '@/domain/attendance/attendance';
import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '@/shared/design-system/variants/badge';

type BadgeIntent = NonNullable<VariantProps<typeof badgeVariants>['intent']>;

export interface ClockStatusBadgeView {
    text: string;
    intent: BadgeIntent;
}

/**
 * 打刻ステータスに対応するバッジ表示情報を返す。
 */
export const getClockStatusBadgeView = (status: ClockStatus): ClockStatusBadgeView => {
    const clockStatusBadgeViewMap: Record<ClockStatus, ClockStatusBadgeView> = {
        in: { text: '勤務中', intent: 'success' },
        break: { text: '休憩中', intent: 'warning' },
        out: { text: '未出勤', intent: 'outline' },
    };
    return clockStatusBadgeViewMap[status];
};