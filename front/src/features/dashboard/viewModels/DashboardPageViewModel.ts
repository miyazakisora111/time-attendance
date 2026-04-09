import { useQueryClient } from '@tanstack/react-query';

import type { ClockAction } from '@/__generated__/enums';
import { useDashboard, dashboardQueryKeys } from '@/features/dashboard/hooks/useDashboardQueries';
import { useDashboardClock } from '@/features/dashboard/hooks/useDashboardClock';
import type { ClockInCardView } from '@/features/attendance/viewModels/ClockInCardViewModel';
import { createClockInCardView } from '@/features/attendance/viewModels/ClockInCardViewModel';

export interface DashboardPageView {
    userName: string | undefined;
    clockInCard: ClockInCardView;
}

type DashboardPageViewModel = DashboardPageView & {
    handleAction: (action: ClockAction) => void;
};

/**
 * ダッシュボード画面専用の ViewModel。
 */
export const useDashboardPageViewModel = (): DashboardPageViewModel => {
    const queryClient = useQueryClient();
    const { data: dashboardData } = useDashboard();

    const { clockStatus, isPending, handleAction } = useDashboardClock({
        onActionSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all() });
        },
    });

    return {
        userName: dashboardData?.user?.name,
        clockInCard: createClockInCardView(clockStatus, isPending),
        handleAction,
    };
};
