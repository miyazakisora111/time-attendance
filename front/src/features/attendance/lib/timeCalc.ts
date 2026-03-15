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

  const clockIn = toDate(row.clockInAt);
  const clockOut = toDate(row.clockOutAt);
  if (!clockIn || !clockOut || clockOut <= clockIn) {
    return null;
  }

  const gross = Math.floor((clockOut.getTime() - clockIn.getTime()) / 60000);
  return Math.max(0, gross - row.breakMinutes);
};

export const formatMinutes = (minutes: number | null): string => {
  if (minutes === null) {
    return '--:--';
  }

  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');

  return `${h}:${m}`;
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
