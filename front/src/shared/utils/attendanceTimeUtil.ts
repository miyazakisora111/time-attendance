export const parseClockToMinutesUtil = (value?: string | null): number | null => {
  if (!value) {
    return null;
  }

  const [h, m] = value.split(':').map((part) => Number(part));
  if (!Number.isInteger(h) || !Number.isInteger(m)) {
    return null;
  }

  return h * 60 + m;
};

export const calculateWorkedMinutesUtil = (
  start?: string | null,
  end?: string | null,
  breakMinutes = 0,
): number | null => {
  const startMin = parseClockToMinutesUtil(start);
  const endMin = parseClockToMinutesUtil(end);

  if (startMin === null || endMin === null) {
    return null;
  }

  const withCrossDay = endMin >= startMin ? endMin - startMin : endMin + 24 * 60 - startMin;
  return Math.max(0, withCrossDay - breakMinutes);
};

export const isCrossDayShiftByClockUtil = (start?: string | null, end?: string | null): boolean => {
  const startMin = parseClockToMinutesUtil(start);
  const endMin = parseClockToMinutesUtil(end);

  return startMin !== null && endMin !== null && endMin < startMin;
};

export const formatMinutesUtil = (minutes: number | null): string => {
  if (minutes === null) {
    return '--:--';
  }

  const safe = Math.max(0, minutes);
  const h = Math.floor(safe / 60)
    .toString()
    .padStart(2, '0');
  const m = (safe % 60).toString().padStart(2, '0');

  return `${h}:${m}`;
};

export const formatWorkedHoursUtil = (hours: number | null | undefined): string => {
  if (hours === null || hours === undefined) {
    return '--:--';
  }

  const totalMinutes = Math.round(hours * 60);
  return formatMinutesUtil(totalMinutes);
};
