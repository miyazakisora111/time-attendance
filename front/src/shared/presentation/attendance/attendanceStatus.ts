import {
    Coffee,
    CheckCircle2,
    AlertCircle,
    type LucideIcon,
} from 'lucide-react';
import type { AttendanceStatus, ClockStatus } from '@/domain/attendance/attendance';

export type StatusIconSpec = {
    icon: LucideIcon;
    iconColor: string;
};

export const STATUS_ICON_MAP: Record<AttendanceStatus, StatusIconSpec> = {
    working: { icon: CheckCircle2, iconColor: 'text-blue-600' },
    break: { icon: Coffee, iconColor: 'text-amber-600' },
    out: { icon: AlertCircle, iconColor: 'text-gray-500' },
};

type BadgeIntent = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';

export interface ClockStatusBadgeView {
    text: string;
    intent: BadgeIntent;
}

const clockStatusBadgeViewMap: Record<ClockStatus, ClockStatusBadgeView> = {
    in: { text: '勤務中', intent: 'success' },
    break: { text: '休憩中', intent: 'warning' },
    out: { text: '未出勤', intent: 'outline' },
};

/**
 * 打刻ステータスに対応するバッジ表示情報を返す。
 */
export const getClockStatusBadgeView = (status: ClockStatus): ClockStatusBadgeView => {
    return clockStatusBadgeViewMap[status];
};