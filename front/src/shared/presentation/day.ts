import { DAY_DEFINITIONS, type DayIndex, type DayType } from '@/domain/day/day';

export type DayLabel = '日' | '月' | '火' | '水' | '木' | '金' | '土';

export type DayPresentation = {
    key: string;
    label: DayLabel;
    type: DayType;
};

export const DAYS: Readonly<Record<DayIndex, DayPresentation>> = {
    0: { ...DAY_DEFINITIONS[0], label: '日' },
    1: { ...DAY_DEFINITIONS[1], label: '月' },
    2: { ...DAY_DEFINITIONS[2], label: '火' },
    3: { ...DAY_DEFINITIONS[3], label: '水' },
    4: { ...DAY_DEFINITIONS[4], label: '木' },
    5: { ...DAY_DEFINITIONS[5], label: '金' },
    6: { ...DAY_DEFINITIONS[6], label: '土' },
} as const;

export const DAY_LIST = Object.values(DAYS);

/** 曜日種別 → 表示用クラス */
export const DAY_TYPE_CLASS: Record<DayType, string> = {
    sunday: 'text-red-600',
    saturday: 'text-blue-600',
    weekday: 'text-gray-500',
} as const;
