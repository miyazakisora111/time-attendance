import React from "react";
import { motion } from "framer-motion";

import { AsyncDataState } from "@/shared/components/states/AsyncDataState";
import { fadeUp } from "@/shared/animations/presets";
import { stagger } from "@/shared/animations/stagger";
import { transitionNormal } from "@/shared/animations/transitions";

import { useMonthlyStatsCardViewModel } from "@/features/dashboard/viewModels/MonthlyStatsCardViewModel";
import { StatItemCard } from "@/features/dashboard/ui/StatItemCard";

/**
 * 月次統計カード。
 *
 * ViewModel から受け取った値のみを使い、ロジックを持たない View 層。
 */
export const MonthlyStatsCard = React.memo(function MonthlyStatsCard() {
  const { stats, isLoading, isError } = useMonthlyStatsCardViewModel();

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <AsyncDataState isLoading={isLoading} isError={isError} isEmpty={stats.length === 0}>
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp} transition={transitionNormal}>
            <StatItemCard {...stat} />
          </motion.div>
        ))}
      </AsyncDataState>
    </motion.div>
  );
});
