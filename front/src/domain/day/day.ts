/** 曜日インデックス */
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** 曜日キー */
export type DayKey =
    | 'sun'
    | 'mon'
    | 'tue'
    | 'wed'
    | 'thu'
    | 'fri'
    | 'sat';

/** 曜日種別 */
export type DayType = 'weekday' | 'sunday' | 'saturday';

/** 曜日定義 */
export const DAY_DEFINITIONS: Readonly<Record<DayIndex, {
    key: DayKey;
    type: DayType;
}>> = {
    0: { key: 'sun', type: 'sunday' },
    1: { key: 'mon', type: 'weekday' },
    2: { key: 'tue', type: 'weekday' },
    3: { key: 'wed', type: 'weekday' },
    4: { key: 'thu', type: 'weekday' },
    5: { key: 'fri', type: 'weekday' },
    6: { key: 'sat', type: 'saturday' },
} as const;
