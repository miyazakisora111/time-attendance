import type { ClockAction, ClockStatus } from '@/__generated__/enums';
import type { getClockStatusBadgeView } from '@/shared/presentation/attendance/clockStatusBadge';

export interface ClockInCardView {
    clockStatus: ClockStatus;
    isPending: boolean;
    statusBadge: ReturnType<typeof getClockStatusBadgeView>;
}

export interface ClockInCardProps {
    view: ClockInCardView;
    onAction: (action: ClockAction) => void;
}
