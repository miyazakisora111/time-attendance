import type { ClockStatus } from '@/__generated__/enums';
import { getClockStatusBadgeView } from '@/shared/presentation/attendance/clockStatusBadge';

/** 打刻カードの表示用データ */
export interface ClockInCardView {
    clockStatus: ClockStatus;
    isPending: boolean;
    statusBadge: ReturnType<typeof getClockStatusBadgeView>;
}

export const createClockInCardView = (
    clockStatus: ClockStatus,
    isPending: boolean,
): ClockInCardView => ({
    clockStatus,
    isPending,
    statusBadge: getClockStatusBadgeView(clockStatus),
});
