import { cva } from "class-variance-authority";

/**
 * Badge バリアント定義
 */
export const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            intent: {
                default:
                    "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
                primary:
                    "border-transparent bg-blue-600 text-white hover:bg-blue-600/80",
                success:
                    "border-transparent bg-green-600 text-white hover:bg-green-600/80",
                warning:
                    "border-transparent bg-amber-500 text-white hover:bg-amber-500/80",
                danger:
                    "border-transparent bg-red-600 text-white hover:bg-red-600/80",
                outline:
                    "text-gray-900 border border-gray-200 bg-transparent hover:bg-gray-50",
            },
            size: {
                sm: "px-2 py-0.5 text-[10px]",
                md: "px-2.5 py-0.5 text-xs",
            },
        },
        defaultVariants: {
            intent: "default",
            size: "md",
        },
    },
);
