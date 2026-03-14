import React from "react";
import { FileEdit, FileText, Plane, Stethoscope } from "lucide-react";
import { Button } from "@/shared/components/buttons/Button";
import { Card, CardContent, CardHeader, CardTitle, Typography } from "@/shared/components";

const quickActions = [
  { icon: Plane, label: "有給申請", color: "text-blue-600", bgColor: "bg-blue-100/50" },
  { icon: Stethoscope, label: "病欠申請", color: "text-red-600", bgColor: "bg-red-100/50" },
  { icon: FileEdit, label: "勤怠修正", color: "text-amber-600", bgColor: "bg-amber-100/50" },
  { icon: FileText, label: "月次レポート", color: "text-green-600", bgColor: "bg-green-100/50" },
] as const;

export const QuickActionsCard = React.memo(function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="text-blue-600" />
          クイックアクション
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.label}
                variant="outline"
                size="lg"
                className="h-24 flex-col border-dashed bg-transparent"
                fullWidth
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full ${action.bgColor}`}>
                  <Icon size={20} className={action.color} strokeWidth={2.5} />
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
