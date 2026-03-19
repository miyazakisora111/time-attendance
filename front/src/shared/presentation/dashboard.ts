import { DAYS_OF_WEEK } from '@/shared/constants/date';
import {
  formatJapaneseDays,
  formatJapaneseHours,
  formatSignedJapaneseHours,
} from '@/shared/presentation/format';

export type DashboardQuickActionKey =
  | 'paid_leave'
  | 'sick_leave'
  | 'attendance_fix'
  | 'monthly_report';

export interface DashboardQuickActionView {
  key: DashboardQuickActionKey;
  label: string;
  colorClassName: string;
  bgColorClassName: string;
}

export const dashboardQuickActions: ReadonlyArray<DashboardQuickActionView> = [
  { key: 'paid_leave', label: '有給申請', colorClassName: 'text-blue-600', bgColorClassName: 'bg-blue-100/50' },
  { key: 'sick_leave', label: '病欠申請', colorClassName: 'text-red-600', bgColorClassName: 'bg-red-100/50' },
  { key: 'attendance_fix', label: '勤怠修正', colorClassName: 'text-amber-600', bgColorClassName: 'bg-amber-100/50' },
  { key: 'monthly_report', label: '月次レポート', colorClassName: 'text-green-600', bgColorClassName: 'bg-green-100/50' },
];

interface DashboardMiniCalendarSource {
  date: string;
  status: 'working' | 'off' | 'holiday' | 'pending';
  isToday: boolean;
  isHoliday: boolean;
}

export interface DashboardMiniCalendarDay {
  key: string;
  day: string;
  isWorkday?: boolean;
  isHoliday?: boolean;
  isToday?: boolean;
}

export const dashboardMiniCalendarDaysOfWeek = DAYS_OF_WEEK;

export const buildDashboardMiniCalendarDays = (
  days: ReadonlyArray<DashboardMiniCalendarSource>,
): DashboardMiniCalendarDay[] => {
  if (days.length === 0) {
    return [];
  }

  const firstDate = new Date(`${days[0].date}T00:00:00`);
  const leadingBlankDays = Array.from({ length: firstDate.getDay() }, (_, index) => ({
    key: `blank-${index}`,
    day: '',
  }));

  const mappedDays = days.map((day) => ({
    key: day.date,
    day: String(new Date(`${day.date}T00:00:00`).getDate()),
    isWorkday: day.status === 'working',
    isHoliday: day.isHoliday,
    isToday: day.isToday,
  }));

  return [...leadingBlankDays, ...mappedDays];
};

export const dashboardMiniCalendarLegends = [
  {
    key: 'workday',
    label: '出勤',
    swatchClassName: 'h-3 w-3 rounded-sm border border-green-200 bg-green-100',
  },
  {
    key: 'holiday',
    label: '休日',
    swatchClassName: 'h-3 w-3 rounded-sm border border-red-200 bg-red-100',
  },
  {
    key: 'today',
    label: '今日',
    swatchClassName: 'h-3 w-3 rounded-sm bg-blue-600',
  },
] as const;

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