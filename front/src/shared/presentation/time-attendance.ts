import type {
  AttendanceStatus,
  ClockStatus,
  LastAction,
} from '@/domain/time-attendance/attendance';
import type { ClockAction } from '@/domain/time-attendance/clock-action';
import { getActionLabel } from '@/shared/presentation/action-label';

type AttendanceCardIntent = 'primary' | 'warning' | 'muted';
type ClockStatusBadgeIntent = 'default' | 'success' | 'warning';
type AttendanceRecordBadgeIntent = 'default' | 'success' | 'warning';

interface AttendanceStatusView {
  title: string;
  description: string;
  intent: AttendanceCardIntent;
}

interface ClockStatusBadgeView {
  text: string;
  intent: ClockStatusBadgeIntent;
}

export interface LastActionView {
  type: string;
  time: string;
}

const clockStatusToAttendanceStatusMap: Record<ClockStatus, AttendanceStatus> = {
  out: 'out',
  in: 'working',
  break: 'break',
};

const attendanceStatusViewMap: Record<AttendanceStatus, AttendanceStatusView> = {
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

const clockStatusBadgeViewMap: Record<ClockStatus, ClockStatusBadgeView> = {
  out: { text: '退勤中', intent: 'default' },
  in: { text: '勤務中', intent: 'success' },
  break: { text: '休憩中', intent: 'warning' },
};

export const attendanceActionButtonLabelMap: Record<ClockAction, string> = {
  in: '出勤',
  out: '退勤',
  break_start: '休憩',
  break_end: '戻り',
};

export const mapClockStatusToAttendanceStatus = (status: ClockStatus): AttendanceStatus => {
  return clockStatusToAttendanceStatusMap[status];
};

export const getAttendanceStatusView = (status: AttendanceStatus): AttendanceStatusView => {
  return attendanceStatusViewMap[status];
};

export const getClockStatusBadgeView = (status: ClockStatus): ClockStatusBadgeView => {
  return clockStatusBadgeViewMap[status];
};

export const getAttendanceRecordStatusBadgeIntent = (status: string): AttendanceRecordBadgeIntent => {
  if (status === '通常') return 'success';
  if (status === '残業') return 'warning';
  return 'default';
};

export const toLastActionView = (lastAction: LastAction): LastActionView => ({
  type: getActionLabel(lastAction.action),
  time: lastAction.time,
});