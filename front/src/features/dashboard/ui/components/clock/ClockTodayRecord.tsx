import React from "react";
import type { ClockStatus } from "./ClockActionButtons";

interface ClockTodayRecordProps {
  status: ClockStatus;
  clockInTime?: string;
  totalWorkedHours?: string;
}

export const ClockTodayRecord = React.memo(function ClockTodayRecord({
  status,
  clockInTime = "09:00",
  totalWorkedHours = "5h 30m"
}: ClockTodayRecordProps) {
  const isWorking = status !== "out";

  return (
    <div className="pt-4 border-t border-gray-100 space-y-2">
      <p className="text-sm font-medium text-gray-600">本日の記録</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">出勤時刻</p>
          <p className="text-lg font-semibold text-gray-900">
            {isWorking ? clockInTime : "--:--"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">勤務時間</p>
          <p className="text-lg font-semibold text-gray-900">
            {isWorking ? totalWorkedHours : "--h --m"}
          </p>
        </div>
      </div>
    </div>
  );
});
