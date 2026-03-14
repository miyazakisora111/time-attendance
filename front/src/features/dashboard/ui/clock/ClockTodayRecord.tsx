import React from "react";
import { Typography } from "@/shared/components";
import type { ClockStatus } from "@/features/dashboard/ui/clock/ClockActionButtons";

interface ClockTodayRecordProps {
  status: ClockStatus;
  clockInTime?: string;
  totalWorkedHours?: string;
}

export const ClockTodayRecord = React.memo(function ClockTodayRecord({
  status,
  clockInTime = "09:00",
  totalWorkedHours = "5h 30m",
}: ClockTodayRecordProps) {
  const isWorking = status !== "out";

  return (
    <section className="space-y-2 border-t border-gray-100 pt-4">
      <Typography variant="label" intent="muted">
        本日の記録
      </Typography>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Typography variant="small" intent="muted" className="mb-1 block">
            出勤時刻
          </Typography>
          <Typography variant="h3">{isWorking ? clockInTime : "--:--"}</Typography>
        </div>
        <div>
          <Typography variant="small" intent="muted" className="mb-1 block">
            勤務時間
          </Typography>
          <Typography variant="h3">{isWorking ? totalWorkedHours : "--h --m"}</Typography>
        </div>
      </div>
    </section>
  );
});
