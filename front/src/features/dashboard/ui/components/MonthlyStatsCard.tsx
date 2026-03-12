import React from "react";
import { BarChart3, Clock, TrendingUp, Calendar } from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/model/useDashboard";
import { Spinner } from "@/shared/components/Spinner";
import { StatItemCard } from "./stats/StatItemCard";

export const MonthlyStatsCard = React.memo(function MonthlyStatsCard() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-lg border border-gray-100 shadow-sm col-span-full">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  const statsConfig = [
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
      subtext: `前月比: ${stats.avgHoursDiff > 0 ? '+' : ''}${stats.avgHoursDiff}時間`,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
    },
    {
      icon: BarChart3,
      label: "残業時間",
      value: `${stats.overtimeHours}時間`,
      subtext: `前月比: ${stats.overtimeDiff > 0 ? '+' : ''}${stats.overtimeDiff}時間`,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat, index) => (
        <StatItemCard key={index} {...stat} />
      ))}
    </div>
  );
});
