import React from "react";
import { motion } from "framer-motion";

import { AsyncDataState } from "@/shared/components/states/AsyncDataState";
import { fadeUp } from "@/shared/animations/presets";
import { stagger } from "@/shared/animations/stagger";
import { transitionNormal } from "@/shared/animations/transitions";

import type { MonthlyStatsCardProps } from "@/features/dashboard/ui/components/MonthlyStatsCard/MonthlyStatsCard.types";
import { StatItemCard } from "@/features/dashboard/ui/components/StatItemCard/StatItemCard";

/**
 * 月次統計カード（Presentational）
 * propsのみで描画し、hooks/stateを持たない。
 */
export const MonthlyStatsCard = React.memo(function MonthlyStatsCard({
    stats,
    isLoading,
    isError,
}: MonthlyStatsCardProps) {
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
