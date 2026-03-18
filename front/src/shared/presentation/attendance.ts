import {
    Coffee,
    CheckCircle2,
    AlertCircle,
    type LucideIcon,
} from 'lucide-react';
import type { AttendanceStatus, ClockAction } from '@/domain/attendance/attendance';

export type StatusIconSpec = {
    icon: LucideIcon;
    iconColor: string;
};

export const STATUS_ICON_MAP: Record<AttendanceStatus, StatusIconSpec> = {
    working: { icon: CheckCircle2, iconColor: 'text-blue-600' },
    break: { icon: Coffee, iconColor: 'text-amber-600' },
    out: { icon: AlertCircle, iconColor: 'text-gray-500' },
};

/**
 * 打刻アクションの表示用ラベル。
 */
export const clockActionLabelMap: Record<ClockAction, string> = {
    in: '出勤',
    out: '退勤',
    break_start: '休憩開始',
    break_end: '休憩終了',
};