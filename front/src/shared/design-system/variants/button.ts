import { cva } from "class-variance-authority";

/**
 * Button バリアント定義
 *
 * tokens に基づくボタンスタイル。
 */
export const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2",
        "whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    ],
    {
        variants: {
            variant: {
                solid: "shadow-sm active:shadow-inner",
                outline: "border-2 bg-transparent hover:bg-black/5",
                ghost: "bg-transparent hover:bg-black/5",
            },
            intent: {
                primary: "",
                secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border-transparent",
                success: "bg-green-600 text-white hover:bg-green-700 border-transparent",
                danger: "bg-red-600 text-white hover:bg-red-700 border-transparent",
                warning: "bg-amber-500 text-white hover:bg-amber-600 border-transparent",
            },
            size: {
                sm: "h-9 px-3 text-xs",
                md: "h-10 px-4",
                lg: "h-12 px-8 text-base",
                icon: "h-10 w-10 p-0",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        compoundVariants: [
            {
                variant: "solid",
                intent: "primary",
                className: "bg-gray-900 text-white hover:bg-black",
            },
            {
                variant: "outline",
                intent: "primary",
                className:
                    "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
            },
            {
                variant: "ghost",
                intent: "primary",
                className: "text-gray-900 hover:bg-gray-100",
            },
        ],
        defaultVariants: {
            variant: "solid",
            intent: "primary",
            size: "md",
        },
    },
);
