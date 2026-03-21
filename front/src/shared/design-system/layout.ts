/**
 * レイアウトユーティリティ
 *
 * spacing の統一に使う stack / cluster ヘルパー。
 * 呼び出し側は unstableClassName にこれらを渡す。
 */

/** 縦方向のスタック (space-y) */
export const stack = {
    xs: "space-y-1",
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
    xl: "space-y-8",
} as const;

/** 横方向のクラスター (space-x) */
export const cluster = {
    xs: "space-x-1",
    sm: "space-x-2",
    md: "space-x-4",
    lg: "space-x-6",
    xl: "space-x-8",
} as const;

/** Grid gap */
export const grid = {
    sm: "grid gap-2",
    md: "grid gap-4",
    lg: "grid gap-6",
    xl: "grid gap-8",
} as const;
