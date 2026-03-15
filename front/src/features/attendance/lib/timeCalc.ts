import {
  calculateWorkedMinutesUtil,
  formatMinutesUtil,
} from '@/shared/utils/attendanceTimeUtil';

export type AttendanceRow = {
  id: string;
  workDate: string;
  workTimezone: string;
  clockInAt: string | null;
  clockOutAt: string | null;
  breakMinutes: number;
  workedMinutes: number | null;
};

const toDate = (iso: string | null): Date | null => {
  if (!iso) {
    return null;
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

/**
 * ISO日時を指定タイムゾーンの表示文字列へ変換する。
 */
export const formatLocalDateTime = (iso: string | null, timezone: string): string => {
  const date = toDate(iso);
  if (!date) {
    return '--:--';
  }

  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: timezone,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

export const computeWorkedMinutes = (row: AttendanceRow): number | null => {
  if (typeof row.workedMinutes === 'number') {
    return Math.max(0, row.workedMinutes);
  }

  const formatToClock = (iso: string | null): string | null => {
    const date = toDate(iso);
    if (!date) {
      return null;
    }

    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return calculateWorkedMinutesUtil(
    formatToClock(row.clockInAt),
    formatToClock(row.clockOutAt),
    row.breakMinutes,
  );
};

export const formatMinutes = (minutes: number | null): string => {
  return formatMinutesUtil(minutes);
};

export const isCrossDayShift = (row: AttendanceRow): boolean => {
  const clockIn = toDate(row.clockInAt);
  const clockOut = toDate(row.clockOutAt);
  if (!clockIn || !clockOut) {
    return false;
  }

  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: row.workTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(clockIn) !== formatter.format(clockOut);
};
