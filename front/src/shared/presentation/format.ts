/**
 * 分数を HH:mm 表記へ整形する。
 */
export const formatMinutes = (minutes: number | null): string => {
    if (minutes === null) return '--:--';

    const safe = Math.max(0, minutes);
    const h = Math.floor(safe / 60).toString().padStart(2, '0');
    const m = (safe % 60).toString().padStart(2, '0');

    return `${h}:${m}`;
};

/**
 * 小数時間を HH:mm 表記へ変換する。
 */
export const formatWorkedHours = (hours: number | null | undefined): string => {
    if (hours == null) return '--:--';
    return formatMinutes(Math.round(hours * 60));
};