import { AnimatePresence, motion } from 'framer-motion';

import type { ClockAction, ClockStatus } from '@/__generated__/enums';
import { Card } from '@/shared/components';
import { ClockActionButtons } from '@/shared/components/buttons/ClockActionButtons';
import { statusSwitch } from '@/shared/animations/presets';
import { transitionFast } from '@/shared/animations/transitions';

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
            <AnimatePresence mode="wait">
                <motion.div
                    key={clockStatus}
                    variants={statusSwitch}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transitionFast}
                >
                    <ClockActionButtons
                        status={clockStatus}
                        isPending={isPending}
                        onAction={onAction}
                    />
                </motion.div>
            </AnimatePresence>
        </Card>
    );
}
