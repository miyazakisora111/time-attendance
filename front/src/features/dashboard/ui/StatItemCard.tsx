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
        <Typography variant="h2" unstableClassName="text-2xl tabular-nums">
          {value}
        </Typography>
        <Typography variant="small" intent="muted" unstableClassName="font-medium">
          {subtext}
        </Typography>
      </CardContent>
    </Card>
  );
});
