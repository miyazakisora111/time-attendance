import type { ClockAction } from '@/__generated__/enums';

export interface RecentActivityCardView {
    clockAction: ClockAction;
    label: string;
    time: string;
}

export interface RecentActivityCardProps {
    view: RecentActivityCardView | null;
    isLoading: boolean;
    isError: boolean;
}
