import React from "react";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Calendar, Clock, TrendingUp } from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardQueries";
import { AsyncDataState } from "@/shared/components/AsyncDataState";
import { StatItemCard } from "@/features/dashboard/ui/StatItemCard";
import {
  buildDashboardMonthlyStatsView,
  type DashboardMonthlyStatKey,
} from "@/shared/presentation/dashboard";

const dashboardMonthlyStatIconMap: Record<DashboardMonthlyStatKey, LucideIcon> = {
  total_hours: Clock,
  work_days: Calendar,
  avg_hours: TrendingUp,
  overtime_hours: BarChart3,
};

export const MonthlyStatsCard = React.memo(function MonthlyStatsCard() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  const statsConfig = stats
    ? buildDashboardMonthlyStatsView({
        totalHours: stats.totalHours,
        targetHours: 160, // 仮値（将来 API から返すか config から取得）
        workDays: stats.workDays,
        remainingDays: 10, // 仮値
        avgHours: stats.avgHours,
        avgHoursDiff: 0, // 仮値
        overtimeHours: stats.overtimeHours,
        overtimeDiff: 0, // 仮値
      }).map((item) => ({
        icon: dashboardMonthlyStatIconMap[item.key],
        label: item.label,
        value: item.value,
        subtext: item.subtext,
        iconColor: item.iconColorClassName,
        iconBgColor: item.iconBgColorClassName,
      }))
    : [];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <AsyncDataState isLoading={isLoading} isError={isError} isEmpty={!stats}>
        {statsConfig.map((stat) => (
          <StatItemCard key={stat.label} {...stat} />
        ))}
      </AsyncDataState>
    </div>
  );
});
