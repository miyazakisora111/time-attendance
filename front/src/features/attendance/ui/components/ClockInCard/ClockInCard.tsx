import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock as ClockIcon } from "lucide-react";

import { Badge, Card, CardContent, CardHeader, CardTitle, Clock } from "@/shared/components";
import { ClockActionButtons } from "@/shared/components/buttons/ClockActionButtons";
import { stack } from "@/shared/design-system/layout";
import { statusSwitch } from "@/shared/animations/presets";
import { transitionFast } from "@/shared/animations/transitions";

import type { ClockInCardProps } from "@/features/attendance/ui/components/ClockInCard/ClockInCard.types";

export const ClockInCard = React.memo(function ClockInCard({
    view,
    onAction,
}: ClockInCardProps) {
    return (
        <Card variant="elevated">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle unstableClassName="flex items-center gap-2">
                        <ClockIcon className="text-blue-600" />
                        打刻
                    </CardTitle>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view.clockStatus}
                            variants={statusSwitch}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={transitionFast}
                        >
                            <Badge intent={view.statusBadge.intent}>{view.statusBadge.text}</Badge>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </CardHeader>
            <CardContent unstableClassName={stack.lg}>
                <Clock />
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view.clockStatus}
                        variants={statusSwitch}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transitionFast}
                    >
                        <ClockActionButtons
                            status={view.clockStatus}
                            isPending={view.isPending}
                            onAction={onAction}
                        />
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>
    );
});
