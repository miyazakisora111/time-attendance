import React from "react";
import { Card, CardContent, CardHeader, CardTitle, Typography } from "@/shared/components";
import { Button } from "@/shared/components/buttons/Button";
import { FileText, Plane, Stethoscope, FileEdit } from "lucide-react";

const quickActions = [
  { icon: Plane, label: "有給申請", color: "text-blue-600", bgColor: "bg-blue-100/50 hover:bg-blue-100" },
  { icon: Stethoscope, label: "病欠申請", color: "text-red-600", bgColor: "bg-red-100/50 hover:bg-red-100" },
  { icon: FileEdit, label: "勤怠修正", color: "text-orange-600", bgColor: "bg-orange-100/50 hover:bg-orange-100" },
  { icon: FileText, label: "月次レポート", color: "text-green-600", bgColor: "bg-green-100/50 hover:bg-green-100" },
];

export const QuickActionsCard = React.memo(function QuickActionsCard() {
  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="text-blue-600" />
          クイックアクション
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-24 flex flex-col gap-3 hover:shadow-sm transition-all border-dashed hover:border-solid bg-transparent"
              >
                <div className={`w-10 h-10 rounded-full ${action.bgColor} flex items-center justify-center transition-colors`}>
                  <Icon size={20} className={action.color} strokeWidth={2.5} />
                </div>
                <Typography variant="small" className="font-medium text-gray-700">{action.label}</Typography>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
