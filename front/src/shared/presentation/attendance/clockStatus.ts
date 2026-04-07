import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '@/shared/design-system/variants/badge';

type BadgeIntent = NonNullable<
    VariantProps<typeof badgeVariants>['intent']
>;

/** 勤怠記録ステータス → バッジ intent */
const ATTENDANCE_STATUS_BADGE_INTENT_MAP: Record<string, BadgeIntent> = {
    通常: 'default',
    残業: 'warning',
    休日: 'outline',
};

/** 勤怠記録ステータスに対応するバッジ intent を返す */
export const getAttendanceStatusBadgeIntent = (
    status: string
): BadgeIntent => {
    return ATTENDANCE_STATUS_BADGE_INTENT_MAP[status] ?? 'default';
};