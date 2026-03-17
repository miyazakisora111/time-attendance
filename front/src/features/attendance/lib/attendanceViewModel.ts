import type { AttendanceStatus, LastAction } from '@/domain/enums/attendance';
import type { ClockAction, ClockStatus } from '@/features/dashboard/ui/clock/ClockActionButtons';

export const mapClockStatusToAttendanceStatus = (status: ClockStatus): AttendanceStatus => {
  switch (status) {
    case 'in':
      return 'working';
    case 'break':
      return 'break';
    default:
      return 'out';
  }
};

export const actionLabelMap: Record<ClockAction, string> = {
  in: '出勤',
  out: '退勤',
  break_start: '休憩開始',
  break_end: '休憩終了',
};

export const toLastAction = (action: ClockAction, timeText: string): LastAction => ({
  type: actionLabelMap[action],
  time: timeText,
});
