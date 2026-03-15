import React from "react";
import { Typography } from "@/shared/components";
import { useCurrentTime } from "@/features/attendance/hooks/useCurrentTime";

export const ClockDisplay = React.memo(function ClockDisplay() {
  const currentTime = useCurrentTime();

  return (
    <div className="rounded-lg from-blue-50 to-indigo-50 py-6 text-center">
      <Typography variant="caption" intent="muted" className="mb-2 block">
        現在時刻
      </Typography>
      <Typography variant="h1" className="mb-1 text-4xl tabular-nums tracking-tight">
        {currentTime.toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </Typography>
      <Typography variant="caption" intent="muted">
        {currentTime.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })}
      </Typography>
    </div>
  );
});
