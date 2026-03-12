import React from "react";
import { Card, CardContent, CardHeader, CardTitle, Typography } from "@/shared/components";
import { IconWrapper } from "@/shared/components/icons/IconWrapper";
import type { LucideIcon } from "lucide-react";

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
    <Card variant="elevated" className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b-0 space-y-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">{label}</CardTitle>
          <IconWrapper
            icon={icon}
            iconColor={iconColor}
            bgColor={iconBgColor}
            className="rounded-xl w-10 h-10"
            strokeWidth={2.5}
            size={20}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <Typography variant="h2" className="text-2xl font-bold text-gray-900">{value}</Typography>
          <Typography variant="small" className="text-gray-500 font-medium">{subtext}</Typography>
        </div>
      </CardContent>
    </Card>
  );
});
