import type { LucideIcon } from 'lucide-react';
import { BarChart3, Calendar, Clock, TrendingUp } from 'lucide-react';

import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardQueries';
import { buildMonthlyStatsView, type MonthlyStatKey } from '@/features/dashboard/builders/buildMonthlyStatsView';

export interface MonthlyStatItemView {
    key: MonthlyStatKey;
    label: string;
    value: string;
    subtext: string;
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
}

export interface MonthlyStatsCardView {
    stats: MonthlyStatItemView[];
    isLoading: boolean;
    isError: boolean;
}

const STAT_ICON_MAP: Record<MonthlyStatKey, LucideIcon> = {
    total_hours: Clock,
    work_days: Calendar,
    avg_hours: TrendingUp,
    overtime_hours: BarChart3,
};

/**
 * 月次統計カード専用の ViewModel。
 */
export const useMonthlyStatsCardViewModel = (): MonthlyStatsCardView => {
    const { data: stats, isLoading, isError } = useDashboardStats();

    const items: MonthlyStatItemView[] = stats
        ? buildMonthlyStatsView(stats).map((item) => ({
            ...item,
            icon: STAT_ICON_MAP[item.key],
            iconColor: item.iconColorClassName,
            iconBgColor: item.iconBgColorClassName,
        }))
        : [];

    return {
        stats: items,
        isLoading,
        isError,
    };
};
