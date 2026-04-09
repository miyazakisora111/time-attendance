import type { ClockStatus } from '@/__generated__/enums';
import { getClockStatusBadgeView } from '@/shared/presentation/attendance/clockStatusBadge';

import type { ClockInCardView } from '@/features/attendance/ui/components/ClockInCard/ClockInCard.types';

export const buildClockInCardView = (
    clockStatus: ClockStatus,
    isPending: boolean,
): ClockInCardView => ({
    clockStatus,
    isPending,
    statusBadge: getClockStatusBadgeView(clockStatus),
});
