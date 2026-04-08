import type { ClockAction, ClockStatus } from '@/__generated__/enums';

import { useClock } from '@/features/attendance/hooks/useClock';
import { useDashboard } from '@/features/dashboard/hooks/useDashboardQueries';

/**
 * ダッシュボード用 打刻フック
 */
export const useDashboardClock = (options?: {
    onActionSuccess?: () => void;
}): {
    clockStatus: ClockStatus;
    isPending: boolean;
    handleAction: (action: ClockAction) => void;
} => {
    const { data } = useDashboard();
    const { clock, isPending } = useClock();

    const handleAction = (action: ClockAction) => {
        clock(action);
        options?.onActionSuccess?.();
    };

    return {
        clockStatus: data?.clockStatus ?? 'out',
        isPending,
        handleAction,
    };
};