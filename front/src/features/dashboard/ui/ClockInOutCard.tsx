import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Clock as ClockIcon } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Clock } from "@/shared/components";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/useDashboardQueries";
import { useDashboardClock } from "@/features/dashboard/hooks/useDashboardClock";
import { ClockActionButtons } from "@/shared/components/buttons/ClockActionButtons";
import { getAttendanceStatusBadgeIntent } from "@/shared/presentation/attendance/attendanceStatus";
import { stack } from "@/shared/design-system/layout";

/**
 * ダッシュボードの打刻カード。
 */
export const ClockInOutCard = React.memo(function ClockInOutCard() {
  const queryClient = useQueryClient();
  const {
    clockStatus,
    isPending,
    handleAction,
  } = useDashboardClock({
    onActionSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all() });
    },
  });
  const statusView = getAttendanceStatusBadgeIntent(clockStatus);

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
      <CardContent unstableClassName={stack.lg}>
        <Clock />
        <ClockActionButtons
          status={clockStatus}
          isPending={isPending}
          onAction={handleAction}
        />
      </CardContent>
    </Card>
  );
});
