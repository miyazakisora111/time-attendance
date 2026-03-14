import React from "react";
import { BarChart3, Calendar, Clock, TrendingUp } from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/model/useDashboard";
import { DataStateWrapper } from "@/shared/components/DataStateWrapper";
import { StatItemCard } from "@/features/dashboard/ui/stats/StatItemCard";

export const MonthlyStatsCard = React.memo(function MonthlyStatsCard() {
  const { data: stats, isLoading } = useDashboardStats();

  const statsConfig = stats
    ? [
      {
        icon: Clock,
        label: "今月の勤務時間",
        value: `${stats.totalHours}時間`,
        subtext: `目標: ${stats.targetHours}時間`,
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-100",
      },
      {
        icon: Calendar,
        label: "出勤日数",
        value: `${stats.workDays}日`,
        subtext: `残り: ${stats.remainingDays}日`,
        iconColor: "text-green-600",
        iconBgColor: "bg-green-100",
      },
      {
        icon: TrendingUp,
        label: "平均勤務時間",
        value: `${stats.avgHours}時間`,
        subtext: `前月比: ${stats.avgHoursDiff > 0 ? "+" : ""}${stats.avgHoursDiff}時間`,
        iconColor: "text-indigo-600",
        iconBgColor: "bg-indigo-100",
      },
      {
        icon: BarChart3,
        label: "残業時間",
        value: `${stats.overtimeHours}時間`,
        subtext: `前月比: ${stats.overtimeDiff > 0 ? "+" : ""}${stats.overtimeDiff}時間`,
        iconColor: "text-amber-600",
        iconBgColor: "bg-amber-100",
      },
    ]
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
