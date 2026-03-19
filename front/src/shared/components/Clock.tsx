import React from "react";
import { Typography } from "@/shared/components/Typography";
import { useCurrentTime } from "@/shared/hooks/useCurrentTime";
import { cva, type VariantProps } from "class-variance-authority";
import { formatJapaneseLongDate, formatJapaneseTime } from "@/shared/presentation/format";

const clockVariants = cva(
    "rounded-lg text-center",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-blue-50 to-indigo-50",
                outline: "border border-gray-200 bg-white",
                ghost: "bg-transparent",
            },
            size: {
                sm: "py-3",
                md: "py-6",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export type ClockVariantProps = VariantProps<typeof clockVariants>;

export type ClockProps = ClockVariantProps & {
    /** タイトル */
    title?: React.ReactNode;
};

/**
 * 時計
 */
export const Clock = React.memo(function Clock({
    title = "現在時刻",
    variant,
    size,
    fullWidth,
}: ClockProps) {
    const now = useCurrentTime(1000);

    return (
        <div className={clockVariants({ variant, size, fullWidth })}>
            {title && (
                <Typography variant="caption" intent="muted" unstableClassName="mb-2 block">
                    {title}
                </Typography>
            )}
            <Typography variant="h1" unstableClassName="mb-1 text-4xl tabular-nums tracking-tight">
                {formatJapaneseTime(now)}
            </Typography>
            <Typography variant="caption" intent="muted" unstableClassName="block">
                {formatJapaneseLongDate(now)}
            </Typography>
        </div>
    );
});