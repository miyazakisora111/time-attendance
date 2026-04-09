import { useQueryClient } from '@tanstack/react-query';

import type { ClockAction } from '@/__generated__/enums';
import { useDashboard, dashboardQueryKeys } from '@/features/dashboard/hooks/useDashboardQueries';
import { useDashboardClock } from '@/features/dashboard/hooks/useDashboardClock';
import { buildClockInCardView } from '@/features/attendance/assemblers/buildClockInCardView';
import type { ClockInCardView } from '@/features/attendance/ui/components/ClockInCard/ClockInCard.types';

export interface DashboardPageData {
    userName: string | undefined;
    clockInCard: ClockInCardView;
    handleAction: (action: ClockAction) => void;
}

/**
 * ダッシュボード画面のFacade Hook。
 * query + commandをまとめ、View生成はlibに委譲する。
 */
export const useDashboardPage = (): DashboardPageData => {
    const queryClient = useQueryClient();
    const { data: dashboardData } = useDashboard();

    const { clockStatus, isPending, handleAction } = useDashboardClock({
        onActionSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all() });
        },
    });

    return {
        userName: dashboardData?.user?.name,
        clockInCard: buildClockInCardView(clockStatus, isPending),
        handleAction,
    };
};
