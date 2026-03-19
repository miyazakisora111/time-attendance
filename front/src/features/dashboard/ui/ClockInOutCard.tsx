import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared/components";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/useDashboardQueries";
import { useAttendanceClock } from "@/features/attendance/hooks/useAttendanceClock";
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
  const queryClient = useQueryClient();
  const {
    clockStatus: status,
    todayAttendance,
    todayWorkedTime,
    isPending,
    handleAction,
  } = useAttendanceClock({
    onActionSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all() });
    },
  });
  const statusView = getClockStatusBadgeView(status);

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
          clockInTime={todayAttendance?.startTime ?? undefined}
          totalWorkedHours={todayWorkedTime}
        />
      </CardContent>
    </Card>
  );
});
