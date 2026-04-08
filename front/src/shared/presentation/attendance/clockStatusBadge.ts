import type { ClockStatus } from '@/__generated__/enums';
import type { VariantProps } from 'class-variance-authority';

import type { badgeVariants } from '@/shared/design-system/variants/badge';

type BadgeIntent = NonNullable<VariantProps<typeof badgeVariants>['intent']>;

interface ClockStatusBadgeView {
    intent: BadgeIntent;
    text: string;
}

const CLOCK_STATUS_BADGE_MAP: Record<ClockStatus, ClockStatusBadgeView> = {
    in: { intent: 'success', text: '勤務中' },
    out: { intent: 'default', text: '未出勤' },
    break: { intent: 'warning', text: '休憩中' },
};

/** ClockStatus に対応するバッジ表示情報を返す */
export const getClockStatusBadgeView = (
    status: ClockStatus,
): ClockStatusBadgeView => {
    return CLOCK_STATUS_BADGE_MAP[status];
};
