import {
    Coffee,
    CheckCircle2,
    AlertCircle,
    type LucideIcon,
} from 'lucide-react';
import type { AttendanceStatus } from '@/domain/attendance/attendance';

export type StatusIconSpec = {
    icon: LucideIcon;
    iconColor: string;
};

export const STATUS_ICON_MAP: Record<AttendanceStatus, StatusIconSpec> = {
    working: { icon: CheckCircle2, iconColor: 'text-blue-600' },
    break: { icon: Coffee, iconColor: 'text-amber-600' },
    out: { icon: AlertCircle, iconColor: 'text-gray-500' },
};