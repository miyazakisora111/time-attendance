import type { ClockAction } from '@/__generated__/enums';

import type { ClockInCardView } from '@/features/attendance/ui/components/ClockInCard/ClockInCard.types';
import type { WorkTimeCardView } from '@/features/attendance/ui/components/WorkTimeCard/WorkTimeCard.types';
import type { ActionCardView } from '@/features/attendance/ui/components/ActionCard/ActionCard.types';
import type { RecentActivityCardView } from '@/features/attendance/ui/components/RecentActivityCard/RecentActivityCard.types';

export interface AttendancePageView {
    clockInCard: ClockInCardView;
    workTimeCard: WorkTimeCardView;
    actionCard: ActionCardView;
    recentActivity: RecentActivityCardView | null;
}

export interface AttendancePageProps extends AttendancePageView {
    isLoading: boolean;
    isError: boolean;
    handleAction: (action: ClockAction) => void;
}
