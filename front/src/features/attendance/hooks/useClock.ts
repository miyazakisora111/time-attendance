import { useQueryClient } from '@tanstack/react-query';
import { toast as sonner } from 'sonner';

import type { ClockAction } from '@/__generated__/enums';
import { getClockActionLabel } from '@/shared/presentation/attendance/clockAction';

import {
    attendanceQueryKeys,
    useClockMutation,
} from '@/features/attendance/hooks/useAttendanceQueries';

/**
 * 打刻共通フック
 */
export const useClock = (): {
    clock: (action: ClockAction) => void;
    isPending: boolean;
} => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useClockMutation();

    const clock = (action: ClockAction) => {
        const label = getClockActionLabel(action);

        mutate(action, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: attendanceQueryKeys.all(),
                });
                sonner.success(`${label}しました`);
            },
            onError: () => {
                sonner.error(`${label}に失敗しました`);
            },
        });
    };

    return {
        clock,
        isPending,
    };
};