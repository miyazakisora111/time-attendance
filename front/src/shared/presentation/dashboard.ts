import {
  formatJapaneseDays,
  formatJapaneseHours,
  formatSignedJapaneseHours,
} from '@/shared/presentation/format';

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

export type DashboardMonthlyStatKey = 'total_hours' | 'work_days' | 'avg_hours' | 'overtime_hours';

export interface DashboardMonthlyStatView {
  key: DashboardMonthlyStatKey;
  label: string;
  value: string;
  subtext: string;
  iconColorClassName: string;
  iconBgColorClassName: string;
}

export const buildDashboardMonthlyStatsView = (
  stats: DashboardStatsLike,
): DashboardMonthlyStatView[] => {
  return [
    {
      key: 'total_hours',
      label: '今月の勤務時間',
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
      label: '残業時間',
      value: formatJapaneseHours(stats.overtimeHours),
      subtext: `前月比: ${formatSignedJapaneseHours(stats.overtimeDiff)}`,
      iconColorClassName: 'text-amber-600',
      iconBgColorClassName: 'bg-amber-100',
    },
  ];
};