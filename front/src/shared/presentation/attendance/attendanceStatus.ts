import {
    Coffee,
    CheckCircle2,
    AlertCircle,
    type LucideIcon,
} from 'lucide-react';
import type { AttendanceStatus } from '@/__generated__/enums';
import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '@/shared/design-system/variants/badge';

export type AttendanceStatusIconView = {
    icon: LucideIcon;
    iconColor: string;
};

type BadgeIntent = NonNullable<
    VariantProps<typeof badgeVariants>['intent']
>;

/** 勤怠ステータス → アイコン表示定義 */
const ATTENDANCE_STATUS_ICON_MAP: Record<
    AttendanceStatus,
    AttendanceStatusIconView
> = {
    working: { icon: CheckCircle2, iconColor: 'text-blue-600' },
    break: { icon: Coffee, iconColor: 'text-amber-600' },
    out: { icon: AlertCircle, iconColor: 'text-gray-500' },
};

/** 勤怠ステータスに対応するアイコン表示情報を返す */
export const getAttendanceStatusIconView = (
    status: AttendanceStatus
): AttendanceStatusIconView => {
    return ATTENDANCE_STATUS_ICON_MAP[status];
};


// TODO:用整理
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
