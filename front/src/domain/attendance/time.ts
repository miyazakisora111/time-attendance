/**
 * 開始/終了時刻から日跨ぎ勤務かどうかを判定する。
 */
export const isCrossDayShiftByClock = (
  start?: string | null,
  end?: string | null,
): boolean => {
  const startMin = parseClockToMinutes(start);
  const endMin = parseClockToMinutes(end);

  return startMin !== null && endMin !== null && endMin < startMin;
};

/**
 * HH:mm 形式の時刻文字列を 0:00 からの経過分に変換する。
 */
export const parseClockToMinutes = (value?: string | null): number | null => {
  if (!value) return null;

  const [h, m] = value.split(':').map(Number);
  if (!Number.isInteger(h) || !Number.isInteger(m)) return null;

  return h * 60 + m;
};
