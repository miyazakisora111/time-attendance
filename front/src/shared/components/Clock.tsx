import React from "react";
import { Typography } from "@/shared/components/Typography";
import { useCurrentTime } from "@/shared/hooks/attendance/useCurrentTime";
import { cn } from "@/shared/utils/style";
import { formatJapaneseLongDate, formatJapaneseTime } from "@/shared/presentation/format";

type ClockProps = {
    /** タイトル */
    title?: React.ReactNode;
    /** クラス名 */
    className?: string;
};

/**
 * 時計
 */
export const Clock = React.memo(function Clock({
    title = "現在時刻",
    className,
}: ClockProps) {
    const now = useCurrentTime(1000);
    
    return (
        <div className={cn("rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 py-6 text-center", className)}>
            {title && (
                <Typography variant="caption" intent="muted" className="mb-2 block">
                    {title}
                </Typography>
            )}
            <Typography variant="h1" className="mb-1 text-4xl tabular-nums tracking-tight">
                {formatJapaneseTime(now)}
            </Typography>
            <Typography variant="caption" intent="muted" className="mb-2 block">
                {formatJapaneseLongDate(now)}
            </Typography>
        </div>
    );
});

export type { ClockProps };