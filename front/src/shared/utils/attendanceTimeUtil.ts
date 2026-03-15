/**
 * HH:mm 形式の文字列を分に変換する。
 *
 * @param value 時刻文字列
 * @returns 0:00 からの経過分。パース不可なら null
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
 * 勤怠データから勤務時間(分)を計算する。
 *
 * 日跨ぎ勤務にも対応する。
 *
 * @param start 勤務開始時刻(HH:mm)
 * @param end 勤務終了時刻(HH:mm)
 * @param breakMinutes 休憩分数
 * @returns 勤務時間（分）
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
 * 日跨ぎ勤務かを判定する。
 */
export const isCrossDayShiftByClockUtil = (start?: string | null, end?: string | null): boolean => {
  const startMin = parseClockToMinutesUtil(start);
  const endMin = parseClockToMinutesUtil(end);

  return startMin !== null && endMin !== null && endMin < startMin;
};

/**
 * 分を HH:mm 形式へ整形する。
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
 * 時間(小数)を HH:mm 形式へ整形する。
 */
export const formatWorkedHoursUtil = (hours: number | null | undefined): string => {
  if (hours === null || hours === undefined) {
    return '--:--';
  }

  const totalMinutes = Math.round(hours * 60);
  return formatMinutesUtil(totalMinutes);
};
