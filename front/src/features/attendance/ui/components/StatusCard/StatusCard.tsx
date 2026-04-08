import { AnimatePresence, motion } from 'framer-motion';

import { Card, Typography, IconWrapper } from '@/shared/components';
import { statusSwitch } from '@/shared/animations/presets';
import { transitionNormal } from '@/shared/animations/transitions';

import type { StatusCardView } from './createStatusCardView';

interface Props {
    view: StatusCardView;
}

export function StatusCard({ view }: Props) {
    return (
        <Card
            variant="flat"
            intent={view.intent}
            padding="md"
            unstableClassName="transition-colors duration-500"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={view.title}
                    className="flex flex-col items-center justify-center text-center h-full"
                    variants={statusSwitch}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transitionNormal}
                >
                    <IconWrapper
                        icon={view.icon}
                        size={32}
                        strokeWidth={2.5}
                        iconColor={view.iconColor}
                        bgColor="bg-white shadow-sm"
                        unstableClassName="w-16 h-16 mb-4 rounded-2xl"
                    />
                    <Typography
                        variant="h3"
                        intent={view.intent}
                        unstableClassName="mb-2"
                    >
                        {view.title}
                    </Typography>
                    <Typography
                        variant="small"
                        intent={view.intent}
                        align="center"
                        unstableClassName="block leading-relaxed"
                    >
                        {view.description}
                    </Typography>
                </motion.div>
            </AnimatePresence>
        </Card>
    );
}
