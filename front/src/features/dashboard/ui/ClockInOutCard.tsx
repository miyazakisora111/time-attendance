import React, { useCallback } from "react";
import { Clock } from "lucide-react";
import type { ClockAction } from "@/domain/attendance/attendance";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared/components";
import { useClockInOut, useDashboardData } from "@/features/dashboard/hooks/useDashboard";
import { ClockActionButtons } from "@/shared/components/buttons/ClockActionButtons";
import { ClockDisplay } from "@/features/dashboard/ui/clock/ClockDisplay";
import { ClockTodayRecord } from "@/features/dashboard/ui/clock/ClockTodayRecord";
import { getClockStatusBadgeView } from "@/shared/presentation/attendance";

/**
 * ダッシュボードの打刻カード。
 *
 * 現在の打刻状態を表示し、打刻アクションを実行する。
 */
export const ClockInOutCard = React.memo(function ClockInOutCard() {
  const { data } = useDashboardData();
  const { mutate: clockInOut, isPending } = useClockInOut();
  const status = data?.clockStatus ?? ("out" as const);
  const todayRecord = data?.todayRecord;
  const statusView = getClockStatusBadgeView(status);

  const handleAction = useCallback(
    (action: ClockAction) => {
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
          <Badge intent={statusView.intent}>{statusView.text}</Badge>
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
