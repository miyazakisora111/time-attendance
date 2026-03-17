import { DAYS_OF_WEEK } from '@/shared/constants/date';
import {
  formatJapaneseDays,
  formatJapaneseHours,
  formatSignedJapaneseHours,
} from '@/shared/presentation/format';

export const DASHBOARD_TITLE = 'ダッシュボード';
export const DASHBOARD_GREETING_FALLBACK = '本日も1日頑張りましょう！';
export const DASHBOARD_QUICK_ACTIONS_TITLE = 'クイックアクション';
export const DASHBOARD_MINI_CALENDAR_TITLE = 'カレンダー';
export const DASHBOARD_MINI_CALENDAR_MONTH = '2025年12月';

export const formatDashboardGreeting = (name?: string | null): string => {
  return name ? `${name}さん、${DASHBOARD_GREETING_FALLBACK}` : DASHBOARD_GREETING_FALLBACK;
};

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

export interface DashboardMiniCalendarDay {
  day: string;
  date: number;
  isWorkday?: boolean;
  isHoliday?: boolean;
  isToday?: boolean;
}

export const dashboardMiniCalendarDaysOfWeek = DAYS_OF_WEEK;

export const dashboardMiniCalendarDays: ReadonlyArray<DashboardMiniCalendarDay> = [
  { day: '', date: 0 },
  { day: '1', date: 1, isWorkday: true },
  { day: '2', date: 2, isWorkday: true },
  { day: '3', date: 3, isWorkday: true },
  { day: '4', date: 4, isWorkday: true },
  { day: '5', date: 5, isWorkday: true },
  { day: '6', date: 6, isHoliday: true },
  { day: '7', date: 7, isHoliday: true },
  { day: '8', date: 8, isWorkday: true },
  { day: '9', date: 9, isWorkday: true },
  { day: '10', date: 10, isWorkday: true },
  { day: '11', date: 11, isWorkday: true },
  { day: '12', date: 12, isWorkday: true },
  { day: '13', date: 13, isHoliday: true },
  { day: '14', date: 14, isHoliday: true },
  { day: '15', date: 15, isWorkday: true },
  { day: '16', date: 16, isToday: true, isWorkday: true },
  { day: '17', date: 17, isWorkday: true },
  { day: '18', date: 18, isWorkday: true },
  { day: '19', date: 19, isWorkday: true },
  { day: '20', date: 20, isHoliday: true },
  { day: '21', date: 21, isHoliday: true },
  { day: '22', date: 22, isWorkday: true },
  { day: '23', date: 23, isWorkday: true },
  { day: '24', date: 24, isWorkday: true },
  { day: '25', date: 25, isWorkday: true },
  { day: '26', date: 26, isWorkday: true },
  { day: '27', date: 27, isHoliday: true },
  { day: '28', date: 28, isHoliday: true },
  { day: '29', date: 29, isWorkday: true },
  { day: '30', date: 30, isWorkday: true },
  { day: '31', date: 31, isWorkday: true },
];

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