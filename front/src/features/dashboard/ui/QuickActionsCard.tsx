import React from "react";
import type { LucideIcon } from "lucide-react";
import { FileEdit, FileText, Plane, Stethoscope } from "lucide-react";
import { Button } from "@/shared/components/buttons/Button";
import { Card, CardContent, CardHeader, CardTitle, Typography } from "@/shared/components";
import {
  DASHBOARD_QUICK_ACTIONS_TITLE,
  dashboardQuickActions,
  type DashboardQuickActionKey,
} from "@/shared/presentation/dashboard";

const dashboardQuickActionIconMap: Record<DashboardQuickActionKey, LucideIcon> = {
  paid_leave: Plane,
  sick_leave: Stethoscope,
  attendance_fix: FileEdit,
  monthly_report: FileText,
};

export const QuickActionsCard = React.memo(function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="text-blue-600" />
          {DASHBOARD_QUICK_ACTIONS_TITLE}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {dashboardQuickActions.map((action) => {
            const Icon = dashboardQuickActionIconMap[action.key];

            return (
              <Button
                key={action.key}
                variant="outline"
                size="lg"
                className="h-24 flex-col border-dashed bg-transparent"
                fullWidth
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full ${action.bgColorClassName}`}>
                  <Icon size={20} className={action.colorClassName} strokeWidth={2.5} />
                </span>
                <Typography variant="small" className="font-medium text-gray-700">
                  {action.label}
                </Typography>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
