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

export const mapAttendanceStatusToClockAction = (status: AttendanceStatus): ClockAction => {
  switch (status) {
    case 'working':
      return 'in';
    case 'break':
      return 'break_start';
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

export const isCrossDayByClockText = (
  clockIn?: string | null,
  clockOut?: string | null,
): boolean => {
  if (!clockIn || !clockOut) {
    return false;
  }

  return clockOut < clockIn;
};

export const toDisplayWorkedHours = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '--:--';
  }

  const totalMinutes = Math.max(0, Math.round(value * 60));
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};
