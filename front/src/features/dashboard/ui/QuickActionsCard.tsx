import React from "react";
import type { LucideIcon } from "lucide-react";
import { FileEdit, FileText, Plane, Stethoscope } from "lucide-react";
import { Button } from "@/shared/components/buttons/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Typography,
} from "@/shared/components";

type DashboardQuickActionKey =
  | "paid_leave"
  | "sick_leave"
  | "attendance_fix"
  | "monthly_report";

type DashboardQuickAction = {
  key: DashboardQuickActionKey;
  label: string;
  icon: LucideIcon;
  colorClassName: string;
  bgColorClassName: string;
};

const QUICK_ACTIONS = [
  {
    key: "paid_leave",
    label: "有給申請",
    icon: Plane,
    colorClassName: "text-blue-600",
    bgColorClassName: "bg-blue-100/50",
  },
  {
    key: "sick_leave",
    label: "病欠申請",
    icon: Stethoscope,
    colorClassName: "text-red-600",
    bgColorClassName: "bg-red-100/50",
  },
  {
    key: "attendance_fix",
    label: "勤怠修正",
    icon: FileEdit,
    colorClassName: "text-amber-600",
    bgColorClassName: "bg-amber-100/50",
  },
  {
    key: "monthly_report",
    label: "月次レポート",
    icon: FileText,
    colorClassName: "text-green-600",
    bgColorClassName: "bg-green-100/50",
  },
] as const satisfies ReadonlyArray<DashboardQuickAction>;

export const QuickActionsCard = React.memo(function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle unstableClassName="flex items-center gap-2">
          <FileText className="text-blue-600" />
          クイックアクション
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.key}
                variant="outline"
                size="lg"
                unstableClassName="h-24 flex-col border-dashed bg-transparent"
                fullWidth
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${action.bgColorClassName}`}
                >
                  <Icon size={20} className={action.colorClassName} strokeWidth={2.5} />
                </span>

                <Typography variant="small" unstableClassName="font-medium text-gray-700">
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
