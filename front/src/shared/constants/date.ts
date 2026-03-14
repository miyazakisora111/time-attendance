export const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DAY_INDEX_MAP = {
    0: "日",
    1: "月",
    2: "火",
    3: "水",
    4: "木",
    5: "金",
    6: "土",
} as const;

export const DAY_KEYS = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
] as const;

export type DayKey = (typeof DAY_KEYS)[number];
