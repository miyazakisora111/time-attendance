import React, { useCallback } from "react";
import { Clock } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared/components";
import { useClockInOut, useDashboardData } from "@/features/dashboard/model/useDashboard";
import { ClockActionButtons } from "@/features/dashboard/ui/clock/ClockActionButtons";
import type {
  ClockAction,
  ClockStatus,
} from "@/features/dashboard/ui/clock/ClockActionButtons";
import { ClockDisplay } from "@/features/dashboard/ui/clock/ClockDisplay";
import { ClockTodayRecord } from "@/features/dashboard/ui/clock/ClockTodayRecord";

const statusConfig: Record<ClockStatus, { text: string; intent: "default" | "success" | "warning" }> = {
  out: { text: "退勤中", intent: "default" },
  in: { text: "勤務中", intent: "success" },
  break: { text: "休憩中", intent: "warning" },
};

export const ClockInOutCard = React.memo(function ClockInOutCard() {
  const { data } = useDashboardData();
  const { mutate: clockInOut, isPending } = useClockInOut();
  const status = (data?.clockStatus ?? "out") as ClockStatus;
  const todayRecord = data?.todayRecord;

  const handleAction = useCallback(
    (action: ClockAction, _nextStatus: ClockStatus) => {
      clockInOut(action);
    },
    [clockInOut]
  );

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="text-blue-600" />
            打刻
          </CardTitle>
          <Badge intent={statusConfig[status].intent}>{statusConfig[status].text}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ClockDisplay />
        <ClockActionButtons
          status={status}
          isPending={isPending}
          onAction={handleAction}
        />
        <ClockTodayRecord
          status={status}
          clockInTime={todayRecord?.clockInTime ?? undefined}
          totalWorkedHours={
            todayRecord?.totalWorkedHours !== null && todayRecord?.totalWorkedHours !== undefined
              ? `${todayRecord.totalWorkedHours}h`
              : undefined
          }
        />
      </CardContent>
    </Card>
  );
});
