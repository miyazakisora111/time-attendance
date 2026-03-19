import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Clock as ClockIcon } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Clock } from "@/shared/components";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/useDashboardQueries";
import { useAttendanceClock } from "@/features/attendance/hooks/useAttendanceClock";
import { ClockActionButtons } from "@/shared/components/buttons/ClockActionButtons";
import { ClockTodayRecord } from "@/features/dashboard/ui/ClockTodayRecord";
import { getClockStatusBadgeView } from "@/shared/presentation/attendance/attendanceStatus";

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
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all() });
    },
  });
  const statusView = getClockStatusBadgeView(status);

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle unstableClassName="flex items-center gap-2">
            <ClockIcon className="text-blue-600" />
            打刻
          </CardTitle>
          <Badge intent={statusView.intent}>{statusView.text}</Badge>
        </div>
      </CardHeader>
      <CardContent unstableClassName="space-y-6">
        <Clock />
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
