import { cva } from "class-variance-authority";

/**
 * Input / Select / Textarea 共通バリアント定義
 *
 * tokens に基づくフォーム入力スタイル。
 */
export const inputVariants = cva(
    [
        "border rounded-lg px-3 py-2 text-sm",
        "transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
    ],
    {
        variants: {
            variant: {
                default: "border-gray-300 bg-white",
                filled: "border-none bg-gray-50",
                error: "border-red-500 bg-white",
            },
            size: {
                sm: "h-9 text-xs",
                md: "h-10",
                lg: "h-12 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    },
);

/**
 * Checkbox / Radio バリアント定義
 */
export const checkableVariants = cva(
    "border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500",
    {
        variants: {
            size: {
                sm: "h-3.5 w-3.5",
                md: "h-4 w-4",
                lg: "h-5 w-5",
            },
        },
        defaultVariants: {
            size: "md",
        },
    },
);

/**
 * Switch バリアント定義
 */
export const switchTrackVariants = cva(
    "rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-500",
    {
        variants: {
            size: {
                sm: "w-9 h-5 bg-gray-200",
                md: "w-11 h-6 bg-gray-200",
                lg: "w-14 h-7 bg-gray-200",
            },
        },
        defaultVariants: {
            size: "md",
        },
    },
);
