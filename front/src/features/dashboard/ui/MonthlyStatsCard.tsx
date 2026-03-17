import React from "react";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Calendar, Clock, TrendingUp } from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/model/useDashboard";
import { DataStateWrapper } from "@/shared/components/DataStateWrapper";
import { StatItemCard } from "@/features/dashboard/ui/stats/StatItemCard";
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
  const { data: stats, isLoading } = useDashboardStats();

  const statsConfig = stats
    ? buildDashboardMonthlyStatsView(stats).map((item) => ({
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
      <DataStateWrapper isLoading={isLoading} isEmpty={!stats}>
        {statsConfig.map((stat) => (
          <StatItemCard key={stat.label} {...stat} />
        ))}
      </DataStateWrapper>
    </div>
  );
});
