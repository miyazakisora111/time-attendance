import { cva } from "class-variance-authority";

/**
 * Typography バリアント定義
 */
export const typographyVariants = cva("text-gray-900", {
    variants: {
        variant: {
            h1: "text-4xl font-bold tracking-tight",
            h2: "text-3xl font-semibold tracking-tight",
            h3: "text-2xl font-semibold",
            body: "text-base leading-relaxed",
            paragraph: "text-base leading-7",
            caption: "text-sm text-gray-500",
            label: "text-sm font-medium",
            small: "text-xs",
        },
        intent: {
            default: "text-gray-900",
            muted: "text-gray-500",
            primary: "text-blue-600",
            success: "text-green-600",
            warning: "text-amber-600",
            danger: "text-red-600",
            white: "text-white",
        },
        align: {
            start: "text-left",
            center: "text-center",
            end: "text-right",
        },
    },
    defaultVariants: {
        variant: "paragraph",
        intent: "default",
        align: "start",
    },
});
