import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Clock } from "lucide-react";
import { useClockInOut } from "@/features/dashboard/model/useDashboard";
import { Badge } from "@/shared/components/data-display/Badge";
import { ClockDisplay } from "./clock/ClockDisplay";
import { ClockActionButtons } from "./clock/ClockActionButtons";
import type { ClockStatus, ClockAction } from "./clock/ClockActionButtons";
import { ClockTodayRecord } from "./clock/ClockTodayRecord";

const statusConfig: Record<ClockStatus, { text: string; variant: "muted" | "success" | "warning" }> = {
  out: { text: "退勤中", variant: "muted" },
  in: { text: "勤務中", variant: "success" },
  break: { text: "休憩中", variant: "warning" },
};

export const ClockInOutCard = React.memo(function ClockInOutCard() {
  const [status, setStatus] = useState<ClockStatus>("out");
  const { mutate: clockInOut, isPending } = useClockInOut();

  const handleAction = useCallback((action: ClockAction, nextStatus: ClockStatus) => {
    clockInOut(action, {
      onSuccess: () => setStatus(nextStatus),
    });
  }, [clockInOut]);

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="text-blue-600" />
            打刻
          </CardTitle>
          <Badge variant={statusConfig[status].variant}>
            {statusConfig[status].text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ClockDisplay />
        <ClockActionButtons status={status} isPending={isPending} onAction={handleAction} />
        <ClockTodayRecord status={status} />
      </CardContent>
    </Card>
  );
});
