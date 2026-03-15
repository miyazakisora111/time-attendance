/**
 * HH:mm 形式の時刻文字列を 0:00 からの経過分に変換する。
 */
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

/**
 * 開始/終了時刻と休憩分から実働分を算出する。
 * 終了時刻が開始時刻より小さい場合は日跨ぎ勤務として計算する。
 */
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

/**
 * 開始/終了時刻から日跨ぎ勤務かどうかを判定する。
 */
export const isCrossDayShiftByClockUtil = (start?: string | null, end?: string | null): boolean => {
  const startMin = parseClockToMinutesUtil(start);
  const endMin = parseClockToMinutesUtil(end);

  return startMin !== null && endMin !== null && endMin < startMin;
};

/**
 * 分数を HH:mm 表記へ整形する。
 */
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

/**
 * 小数時間を HH:mm 表記へ変換する。
 */
export const formatWorkedHoursUtil = (hours: number | null | undefined): string => {
  if (hours === null || hours === undefined) {
    return '--:--';
  }

  const totalMinutes = Math.round(hours * 60);
  return formatMinutesUtil(totalMinutes);
};
