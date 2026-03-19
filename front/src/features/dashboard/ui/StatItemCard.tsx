import React from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Typography } from "@/shared/components";
import { IconWrapper } from "@/shared/components/icons/IconWrapper";

interface StatItemCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

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
      <CardHeader className="space-y-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">{label}</CardTitle>
          <IconWrapper
            icon={icon}
            iconColor={iconColor}
            bgColor={iconBgColor}
            className="h-10 w-10 rounded-xl"
            strokeWidth={2.5}
            size={20}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Typography variant="h2" className="text-2xl tabular-nums">
          {value}
        </Typography>
        <Typography variant="small" intent="muted" className="font-medium">
          {subtext}
        </Typography>
      </CardContent>
    </Card>
  );
});
