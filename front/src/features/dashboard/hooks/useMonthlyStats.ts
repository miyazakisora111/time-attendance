import type { LucideIcon } from 'lucide-react';
import { BarChart3, Calendar, Clock, TrendingUp } from 'lucide-react';

import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardQueries';
import { buildMonthlyStatsView, type MonthlyStatKey } from '@/features/dashboard/assemblers/buildMonthlyStatsView';
import type { MonthlyStatsCardProps } from '@/features/dashboard/ui/components/MonthlyStatsCard/MonthlyStatsCard.types';

const STAT_ICON_MAP: Record<MonthlyStatKey, LucideIcon> = {
    total_hours: Clock,
    work_days: Calendar,
    avg_hours: TrendingUp,
    overtime_hours: BarChart3,
};

/**
 * 月次統計のHook。
 * 統計データを取得し、View生成はlibに委譲する。
 */
export const useMonthlyStats = (): MonthlyStatsCardProps => {
    const { data: stats, isLoading, isError } = useDashboardStats();

    const items = stats
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
