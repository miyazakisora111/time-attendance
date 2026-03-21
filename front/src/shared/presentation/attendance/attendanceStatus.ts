import {
    Coffee,
    CheckCircle2,
    AlertCircle,
    type LucideIcon,
} from 'lucide-react';
import type { AttendanceStatus } from '@/__generated__/enums';

export type AttendanceStatusIconSpec = {
    icon: LucideIcon;
    iconColor: string;
};

/**
 * 勤怠ステータスに対応するアイコン表示情報を返す。
 */
export const getAttendanceStatusIconSpec = (status: AttendanceStatus): AttendanceStatusIconSpec => {
    const statusIconMap: Record<AttendanceStatus, AttendanceStatusIconSpec> = {
        working: { icon: CheckCircle2, iconColor: 'text-blue-600' },
        break: { icon: Coffee, iconColor: 'text-amber-600' },
        out: { icon: AlertCircle, iconColor: 'text-gray-500' },
    };
    return statusIconMap[status];
};