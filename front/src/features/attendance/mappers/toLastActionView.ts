import { type LastAction, type LastActionView } from '@/features/attendance/ui/types';
import { getClockActionLabel } from '@/shared/presentation/attendance/clockAction';

export const toLastActionView = (lastAction: LastAction | null): LastActionView | null => {
    if (!lastAction) return null;

    return {
        label: getClockActionLabel(lastAction.clockAction),
        time: lastAction.time,
    };
};