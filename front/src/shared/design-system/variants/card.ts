import { cva } from "class-variance-authority";

/**
 * Card バリアント定義
 */
export const cardVariants = cva(
    ["bg-white text-gray-900 transition-all duration-200"],
    {
        variants: {
            variant: {
                default: "border border-gray-200 rounded-xl shadow-sm",
                elevated: "border border-gray-100 rounded-2xl shadow-lg",
                glass:
                    "bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl",
                flat: "border-none rounded-2xl shadow-none",
            },
            padding: {
                none: "p-0",
                sm: "p-4",
                md: "p-6",
                lg: "p-8",
            },
            intent: {
                default: "",
                primary: "bg-blue-50 text-blue-900 border-blue-100",
                success: "bg-emerald-50 text-emerald-900 border-emerald-100",
                warning: "bg-amber-50 text-amber-900 border-amber-100",
                danger: "bg-rose-50 text-rose-900 border-rose-100",
                muted: "bg-gray-50 text-gray-900 border-gray-200",
            },
        },
        defaultVariants: {
            variant: "default",
            padding: "md",
            intent: "default",
        },
    },
);
