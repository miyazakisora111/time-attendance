import type { LucideIcon } from 'lucide-react';
import type { AttendanceStatus } from '@/__generated__/enums';
import { getAttendanceStatusIconView } from '@/shared/presentation/attendance/attendanceStatus';

export interface StatusCardView {
    title: string;
    description: string;
    intent: 'primary' | 'warning' | 'muted';
    icon: LucideIcon;
    iconColor: string;
}

const STATUS_MAP: Record<AttendanceStatus, Omit<StatusCardView, 'icon' | 'iconColor'>> = {
    working: {
        title: '勤務中',
        description: '今日も順調に業務が進んでいます。適度に休憩を取りましょう。',
        intent: 'primary',
    },
    break: {
        title: '休憩中',
        description: 'リフレッシュして、次の業務に備えましょう。',
        intent: 'warning',
    },
    out: {
        title: '未出勤',
        description: '業務を開始する準備はできましたか？',
        intent: 'muted',
    },
};

export const createStatusCardView = (status: AttendanceStatus): StatusCardView => {
    const base = STATUS_MAP[status];
    const iconView = getAttendanceStatusIconView(status);
    return { ...base, icon: iconView.icon, iconColor: iconView.iconColor };
};
