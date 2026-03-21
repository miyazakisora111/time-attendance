/**
 * デザイントークン
 *
 * UIの見た目を制御する唯一の真実源(single source of truth)。
 * すべてのコンポーネント・バリアントはここで定義された値を参照する。
 */

// ─── Colors ──────────────────────────────────────────────

export const colors = {
    // Brand
    primary: "bg-gray-900 text-white",
    primaryHover: "hover:bg-black",
    primaryText: "text-blue-600",

    // Semantic
    success: "bg-green-600 text-white",
    successHover: "hover:bg-green-700",
    successSoft: "bg-emerald-50 text-emerald-900 border-emerald-100",

    danger: "bg-red-600 text-white",
    dangerHover: "hover:bg-red-700",
    dangerSoft: "bg-rose-50 text-rose-900 border-rose-100",

    warning: "bg-amber-500 text-white",
    warningHover: "hover:bg-amber-600",
    warningSoft: "bg-amber-50 text-amber-900 border-amber-100",

    // Neutral
    surface: "bg-white text-gray-900",
    surfaceMuted: "bg-gray-50 text-gray-900",
    surfaceElevated: "bg-white",
    overlay: "bg-black/40",

    // Text
    text: "text-gray-900",
    textMuted: "text-gray-500",
    textInverse: "text-white",

    // Borders
    border: "border-gray-200",
    borderLight: "border-gray-100",
    borderError: "border-red-500",

    // Focus
    focusRing: "focus:ring-2 focus:ring-blue-500 focus:outline-none",
    focusRingPrimary: "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",

    // Accent icon colors
    accentBlue: "text-blue-600",
    accentGreen: "text-green-600",
    accentAmber: "text-amber-600",
    accentRed: "text-red-600",
} as const;

// ─── Typography ──────────────────────────────────────────

export const typography = {
    h1: "text-4xl font-bold tracking-tight",
    h2: "text-3xl font-semibold tracking-tight",
    h3: "text-2xl font-semibold",
    body: "text-base leading-relaxed",
    label: "text-sm font-medium",
    caption: "text-sm text-gray-500",
    small: "text-xs",
} as const;

// ─── Spacing ─────────────────────────────────────────────

export const spacing = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
} as const;

// ─── Radius ──────────────────────────────────────────────

export const radius = {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-full",
} as const;

// ─── Shadow ──────────────────────────────────────────────

export const shadow = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
} as const;

// ─── Input sizing helpers ────────────────────────────────

export const inputBase =
    "border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" as const;

export const inputError = "border-red-500" as const;
export const inputDefault = "border-gray-300" as const;
