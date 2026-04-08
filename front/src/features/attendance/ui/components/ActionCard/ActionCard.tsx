import type { ClockAction, ClockStatus } from '@/__generated__/enums';
import { Card } from '@/shared/components';
import { ClockActionButtons } from '@/shared/components/buttons/ClockActionButtons';

interface Props {
    clockStatus: ClockStatus;
    isPending: boolean;
    onAction: (action: ClockAction) => void;
}

export function ActionCard({ clockStatus, isPending, onAction }: Props) {
    return (
        <Card
            padding="lg"
            intent="primary"
            unstableClassName="border-none shadow-sm rounded-3xl"
        >
            <ClockActionButtons
                status={clockStatus}
                isPending={isPending}
                onAction={onAction}
            />
        </Card>
    );
}
