import React from "react";
import { type ClockStatus, isWorking } from "@/domain/attendance/attendance";
import { Typography } from "@/shared/components";
import { EMPTY_DURATION_TEXT, EMPTY_TIME_TEXT } from "@/shared/presentation/format";

interface ClockTodayRecordProps {
  status: ClockStatus;
  clockInTime?: string;
  totalWorkedHours?: string;
}

export const ClockTodayRecord = React.memo(function ClockTodayRecord({
  status,
  clockInTime,
  totalWorkedHours,
}: ClockTodayRecordProps) {
  const isWorkingStatus = isWorking(status);

  return (
    <section className="space-y-2 border-t border-gray-100 pt-4">
      <Typography variant="label" intent="muted">
        本日の記録
      </Typography>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Typography variant="small" intent="muted" unstableClassName="mb-1 block">
            出勤時刻
          </Typography>
          <Typography variant="h3">{isWorkingStatus ? clockInTime : EMPTY_TIME_TEXT}</Typography>
        </div>
        <div>
          <Typography variant="small" intent="muted" unstableClassName="mb-1 block">
            勤務時間
          </Typography>
          <Typography variant="h3">{isWorkingStatus ? totalWorkedHours : EMPTY_DURATION_TEXT}</Typography>
        </div>
      </div>
    </section>
  );
});
