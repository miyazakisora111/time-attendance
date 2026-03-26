/**
 * 分数を HH:mm 表記へ整形する。
 */
const JAPANESE_LOCALE = 'ja-JP';

export const EMPTY_TIME_TEXT = '--:--';
export const EMPTY_TIME_RANGE_TEXT = '--:-- - --:--';
export const EMPTY_DURATION_TEXT = '--h --m';
export const EMPTY_VALUE_TEXT = '-';

export const formatMinutes = (minutes: number | null | undefined): string => {
    if (minutes === null || typeof minutes === 'undefined') return EMPTY_TIME_TEXT;

    const safe = Math.max(0, minutes);
    const h = Math.floor(safe / 60).toString().padStart(2, '0');
    const m = (safe % 60).toString().padStart(2, '0');

    return `${h}:${m}`;
};

/**
 * 小数時間を HH:mm 表記へ変換する。
 */
export const formatWorkedHours = (hours: number | null | undefined): string => {
    if (hours == null) return EMPTY_TIME_TEXT;
    return formatMinutes(Math.round(hours * 60));
};

export const formatHoursText = (hours: number | null | undefined): string => {
    if (hours == null) return EMPTY_VALUE_TEXT;
    return `${hours}h`;
};

export const formatJapaneseHours = (hours: number | null | undefined): string => {
    if (hours == null) return EMPTY_VALUE_TEXT;
    return `${hours}時間`;
};

export const formatJapaneseDays = (days: number | null | undefined): string => {
    if (days == null) return EMPTY_VALUE_TEXT;
    return `${days}日`;
};

export const formatSignedJapaneseHours = (hours: number | null | undefined): string => {
    if (hours == null) return EMPTY_VALUE_TEXT;
    const sign = hours > 0 ? '+' : '';
    return `${sign}${hours}時間`;
};

export const formatClockText = (value?: string | null): string => {
    return value || EMPTY_VALUE_TEXT;
};

export const formatJapaneseHourMinute = (date: Date): string => {
    return date.toLocaleTimeString(JAPANESE_LOCALE, {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatJapaneseTime = (date: Date): string => {
    return date.toLocaleTimeString(JAPANESE_LOCALE, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const formatJapaneseLongDate = (date: Date): string => {
    return date.toLocaleDateString(JAPANESE_LOCALE, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });
};

export const formatJapaneseYearMonth = (date: Date): string => {
    return date.toLocaleDateString(JAPANESE_LOCALE, {
        year: 'numeric',
        month: 'long',
    });
};