import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Calendar, Clock, TrendingUp } from "lucide-react";

import { AsyncDataState } from "@/shared/components/states/AsyncDataState";
import { formatJapaneseHours, formatJapaneseDays, formatSignedJapaneseHours } from "@/shared/utils/format";
import { fadeUp } from "@/shared/animations/presets";
import { stagger } from "@/shared/animations/stagger";
import { transitionNormal } from "@/shared/animations/transitions";

import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardQueries";
import { StatItemCard } from "@/features/dashboard/ui/StatItemCard";

interface DashboardStatsLike {
  totalHours: number;
  targetHours: number;
  workDays: number;
  remainingDays: number;
  avgHours: number;
  avgHoursDiff: number;
  overtimeHours: number;
  overtimeDiff: number;
}

type DashboardMonthlyStatKey = 'total_hours' | 'work_days' | 'avg_hours' | 'overtime_hours';

interface DashboardMonthlyStatView {
  key: DashboardMonthlyStatKey;
  label: string;
  value: string;
  subtext: string;
  iconColorClassName: string;
  iconBgColorClassName: string;
}

const buildDashboardMonthlyStatsView = (
  stats: DashboardStatsLike,
): DashboardMonthlyStatView[] => {
  return [
    {
      key: 'total_hours',
      label: '合計勤務時間',
      value: formatJapaneseHours(stats.totalHours),
      subtext: `目標: ${formatJapaneseHours(stats.targetHours)}`,
      iconColorClassName: 'text-blue-600',
      iconBgColorClassName: 'bg-blue-100',
    },
    {
      key: 'work_days',
      label: '出勤日数',
      value: formatJapaneseDays(stats.workDays),
      subtext: `残り: ${formatJapaneseDays(stats.remainingDays)}`,
      iconColorClassName: 'text-green-600',
      iconBgColorClassName: 'bg-green-100',
    },
    {
      key: 'avg_hours',
      label: '平均勤務時間',
      value: formatJapaneseHours(stats.avgHours),
      subtext: `前月比: ${formatSignedJapaneseHours(stats.avgHoursDiff)}`,
      iconColorClassName: 'text-indigo-600',
      iconBgColorClassName: 'bg-indigo-100',
    },
    {
      key: 'overtime_hours',
      label: '合計残業時間',
      value: formatJapaneseHours(stats.overtimeHours),
      subtext: `前月比: ${formatSignedJapaneseHours(stats.overtimeDiff)}`,
      iconColorClassName: 'text-amber-600',
      iconBgColorClassName: 'bg-amber-100',
    },
  ];
};

const dashboardMonthlyStatIconMap: Record<DashboardMonthlyStatKey, LucideIcon> = {
  total_hours: Clock,
  work_days: Calendar,
  avg_hours: TrendingUp,
  overtime_hours: BarChart3,
};

export const MonthlyStatsCard = React.memo(function MonthlyStatsCard() {
  const { data: stats, isLoading, isError } = useDashboardStats();

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
    <motion.div
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <AsyncDataState isLoading={isLoading} isError={isError} isEmpty={!stats}>
        {statsConfig.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp} transition={transitionNormal}>
            <StatItemCard {...stat} />
          </motion.div>
        ))}
      </AsyncDataState>
    </motion.div>
  );
});
