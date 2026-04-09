import React from "react";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle, Typography } from "@/shared/components";
import { IconWrapper } from "@/shared/components/icons/IconWrapper";
import { fadeIn } from "@/shared/animations/presets";
import { transitionNormal } from "@/shared/animations/transitions";

import type { StatItemCardProps } from "@/features/dashboard/ui/components/StatItemCard/StatItemCard.types";

export const StatItemCard = React.memo(function StatItemCard({
    label,
    value,
    subtext,
    icon,
    iconColor,
    iconBgColor,
}: StatItemCardProps) {
    return (
        <Card variant="elevated">
            <CardHeader unstableClassName="space-y-0 pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle unstableClassName="text-sm">
                        <Typography variant="caption">{label}</Typography>
                    </CardTitle>
                    <IconWrapper
                        icon={icon}
                        iconColor={iconColor}
                        bgColor={iconBgColor}
                        unstableClassName="h-10 w-10 rounded-xl"
                        strokeWidth={2.5}
                        size={20}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <motion.div
                    key={value}
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    transition={transitionNormal}
                >
                    <Typography variant="h2" unstableClassName="text-2xl tabular-nums">
                        {value}
                    </Typography>
                </motion.div>
                <Typography variant="small" intent="muted" unstableClassName="font-medium">
                    {subtext}
                </Typography>
            </CardContent>
        </Card>
    );
});
