import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { BarChart3, Calendar, Clock, TrendingUp } from 'lucide-react';

import type { ClockAction } from '@/__generated__/enums';
import { formatJapaneseYearMonth } from '@/shared/utils/format';
import { AppRoutePath } from '@/config/routes';

import { useDashboard, dashboardQueryKeys } from '@/features/dashboard/hooks/useDashboardQueries';
import { useDashboardClock } from '@/features/dashboard/hooks/useDashboardClock';
import { useDashboardCalendar } from '@/features/dashboard/hooks/useDashboardCalendar';
import { buildClockInCardView } from '@/features/attendance/assemblers/buildClockInCardView';
import { buildMiniCalendarDays } from '@/features/dashboard/assemblers/buildMiniCalendarDays';
import { buildMonthlyStatsView, type MonthlyStatKey } from '@/features/dashboard/assemblers/buildMonthlyStatsView';
import { buildRecentRecordsView } from '@/features/dashboard/assemblers/buildRecentRecordsView';
import type { DashboardPageProps } from '@/features/dashboard/ui/page/DashBoardPage.types';
import type { QuickActionKey } from '@/features/dashboard/ui/components/QuickActionsCard/QuickActionsCard.types';

const STAT_ICON_MAP: Record<MonthlyStatKey, LucideIcon> = {
    total_hours: Clock,
    work_days: Calendar,
    avg_hours: TrendingUp,
    overtime_hours: BarChart3,
};

const QUICK_ACTION_ROUTES: Record<QuickActionKey, string> = {
    attendance_fix: AppRoutePath.Attendance,
    monthly_report: AppRoutePath.Dashboard,
};

/**
 * ダッシュボード画面のFacade Hook。
 * query + commandをまとめ、View生成はassemblersに委譲する。
 */
export const useDashboardPage = (): DashboardPageProps => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: dashboardData } = useDashboard();

    const { clockStatus, isPending, handleAction } = useDashboardClock({
        onActionSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all() });
        },
    });

    // --- MiniCalendar ---
    const { currentMonth, calendar, isLoading: calLoading, isError: calError, nextMonth, prevMonth } = useDashboardCalendar();

    // --- MonthlyStats ---
    const statsItems = dashboardData?.stats
        ? buildMonthlyStatsView(dashboardData.stats).map((item) => ({
            ...item,
            icon: STAT_ICON_MAP[item.key],
            iconColor: item.iconColorClassName,
            iconBgColor: item.iconBgColorClassName,
        }))
        : [];

    // --- RecentRecords ---
    const recentRows = dashboardData?.recentRecords
        ? buildRecentRecordsView(dashboardData.recentRecords)
        : [];

    const handleQuickAction = (key: QuickActionKey) => {
        navigate(QUICK_ACTION_ROUTES[key]);
    };

    return {
        userName: dashboardData?.user?.name,
        clockInCard: buildClockInCardView(clockStatus, isPending),
        handleAction,
        handleQuickAction,
        miniCalendar: {
            monthLabel: formatJapaneseYearMonth(currentMonth),
            days: buildMiniCalendarDays(calendar?.days ?? []),
            isLoading: calLoading,
            isError: calError,
            nextMonth,
            prevMonth,
        },
        monthlyStats: {
            stats: statsItems,
            isLoading: !dashboardData,
            isError: false,
        },
        recentRecords: {
            records: recentRows,
            isLoading: !dashboardData,
            isError: false,
        },
    };
};
