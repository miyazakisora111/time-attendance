const JAPANESE_LOCALE = 'ja-JP';

/** 空表示 */
export const EMPTY_TIME_TEXT = '--:--';
export const EMPTY_TIME_RANGE_TEXT = '--:-- - --:--';
export const EMPTY_DURATION_TEXT = '--h --m';
export const EMPTY_VALUE_TEXT = '-';

const isNil = (v: unknown): v is null | undefined => v == null;

const formatLocalTime = (
    date: Date,
    options: Intl.DateTimeFormatOptions
): string =>
    date.toLocaleTimeString(JAPANESE_LOCALE, options);

const formatLocalDate = (
    date: Date,
    options: Intl.DateTimeFormatOptions
): string =>
    date.toLocaleDateString(JAPANESE_LOCALE, options);

/** 分数 → HH:mm */
export const formatMinutes = (
    minutes: number | null | undefined
): string => {
    if (isNil(minutes)) return EMPTY_TIME_TEXT;

    const safe = Math.max(0, minutes);
    const h = Math.floor(safe / 60).toString().padStart(2, '0');
    const m = (safe % 60).toString().padStart(2, '0');

    return `${h}:${m}`;
};

/** 小数時間 → HH:mm */
export const formatWorkedHours = (
    hours: number | null | undefined
): string => {
    if (isNil(hours)) return EMPTY_TIME_TEXT;
    return formatMinutes(Math.round(hours * 60));
};

/** 時間表記（h） */
export const formatHoursText = (
    hours: number | null | undefined
): string => {
    if (isNil(hours)) return EMPTY_VALUE_TEXT;
    return `${hours}h`;
};

/** 日本語時間表記 */
export const formatJapaneseHours = (
    hours: number | null | undefined
): string => {
    if (isNil(hours)) return EMPTY_VALUE_TEXT;
    return `${hours}時間`;
};

/** 日本語日数表記 */
export const formatJapaneseDays = (
    days: number | null | undefined
): string => {
    if (isNil(days)) return EMPTY_VALUE_TEXT;
    return `${days}日`;
};

/** 符号付き日本語時間表記 */
export const formatSignedJapaneseHours = (
    hours: number | null | undefined
): string => {
    if (isNil(hours)) return EMPTY_VALUE_TEXT;
    const sign = hours > 0 ? '+' : '';
    return `${sign}${hours}時間`;
};

/** 時計文字列 */
export const formatClockText = (
    value?: string | null
): string => value || EMPTY_VALUE_TEXT;

/** HH:mm（日本語ロケール） */
export const formatJapaneseHourMinute = (date: Date): string =>
    formatLocalTime(date, { hour: '2-digit', minute: '2-digit' });

/** HH:mm:ss（日本語ロケール） */
export const formatJapaneseTime = (date: Date): string =>
    formatLocalTime(date, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

/** 年月日（曜日付き） */
export const formatJapaneseLongDate = (date: Date): string =>
    formatLocalDate(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

/** 年月 */
export const formatJapaneseYearMonth = (date: Date): string =>
    formatLocalDate(date, {
        year: 'numeric',
        month: 'long',
    });