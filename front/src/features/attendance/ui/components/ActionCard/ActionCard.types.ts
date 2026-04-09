import type { ClockAction, ClockStatus } from '@/__generated__/enums';

export interface ActionCardView {
    clockStatus: ClockStatus;
    isPending: boolean;
}

export interface ActionCardProps {
    clockStatus: ClockStatus;
    isPending: boolean;
    onAction: (action: ClockAction) => void;
}
