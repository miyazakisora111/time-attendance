import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock as ClockIcon } from "lucide-react";

import type { ClockAction, ClockStatus } from "@/__generated__/enums";
import { Badge, Card, CardContent, CardHeader, CardTitle, Clock } from "@/shared/components";
import { ClockActionButtons } from "@/shared/components/buttons/ClockActionButtons";
import { stack } from "@/shared/design-system/layout";
import { getClockStatusBadgeView } from "@/shared/presentation/attendance/clockStatusBadge";
import { statusSwitch } from "@/shared/animations/presets";
import { transitionFast } from "@/shared/animations/transitions";

interface Props {
  clockStatus: ClockStatus;
  isPending: boolean;
  onAction: (action: ClockAction) => void;
}

/**
 * 打刻カード。
 * データ取得は行わず、親から props で受け取る。
 */
export const ClockInCard = React.memo(function ClockInCard({
  clockStatus,
  isPending,
  onAction,
}: Props) {
  const statusView = getClockStatusBadgeView(clockStatus);

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
              key={clockStatus}
              variants={statusSwitch}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transitionFast}
            >
              <Badge intent={statusView.intent}>{statusView.text}</Badge>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardHeader>
      <CardContent unstableClassName={stack.lg}>
        <Clock />
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
      </CardContent>
    </Card>
  );
});
