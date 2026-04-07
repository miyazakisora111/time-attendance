import type { ClockAction } from '@/__generated__/enums';
import { useClock } from '@/features/attendance/hooks/useClock';

/**
 * ダッシュボード用 打刻フック
 */
export const useDashboardClock = (options?: {
    onActionSuccess?: () => void;
}): {
    isPending: boolean;
    handleAction: (action: ClockAction) => void;
} => {
    const { clock, isPending } = useClock();

    const handleAction = (action: ClockAction) => {
        clock(action);
        options?.onActionSuccess?.();
    };

    return {
        isPending,
        handleAction,
    };
};