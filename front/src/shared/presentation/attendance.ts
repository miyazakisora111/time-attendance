import {
    Coffee,
    CheckCircle2,
    AlertCircle,
    type LucideIcon,
} from 'lucide-react';
import type { AttendanceStatus, ClockAction, ClockStatus } from '@/domain/attendance/attendance';

export interface ClockStatusBadgeView {
    text: string;
    intent: 'default' | 'success' | 'warning';
}

type AttendanceRecordStatus = '通常' | '残業' | '休日';

const clockStatusBadgeViewMap: Record<ClockStatus, ClockStatusBadgeView> = {
    in: { text: '勤務中', intent: 'success' },
    out: { text: '退勤', intent: 'default' },
    break: { text: '休憩中', intent: 'warning' },
};

const attendanceRecordStatusIntentMap: Record<AttendanceRecordStatus, 'default' | 'warning' | 'danger'> = {
    通常: 'default',
    残業: 'warning',
    休日: 'danger',
};

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

/**
 * 打刻状態に応じたバッジ表示情報を返す。
 */
export const getClockStatusBadgeView = (status: ClockStatus): ClockStatusBadgeView => {
    return clockStatusBadgeViewMap[status];
};

/**
 * 打刻アクションに対応する表示ラベルを返す。
 */
export const getActionLabel = (action: ClockAction): string => {
    return clockActionLabelMap[action];
};

/**
 * 勤怠記録のステータスに応じたバッジintentを返す。
 */
export const getAttendanceRecordStatusBadgeIntent = (
    status: AttendanceRecordStatus,
): 'default' | 'warning' | 'danger' => {
    return attendanceRecordStatusIntentMap[status];
};