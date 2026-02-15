import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/atoms/CardComposite";
import { Button } from "../../../shared/components/atoms/Button";
import { FileText, Plane, Stethoscope, FileEdit } from "lucide-react";

const quickActions = [
  { icon: Plane, label: "有給申請", color: "text-blue-600", bgColor: "bg-blue-100" },
  { icon: Stethoscope, label: "病欠申請", color: "text-red-600", bgColor: "bg-red-100" },
  { icon: FileEdit, label: "勤怠修正", color: "text-orange-600", bgColor: "bg-orange-100" },
  { icon: FileText, label: "月次レポート", color: "text-green-600", bgColor: "bg-green-100" },
];

export function QuickActionsCard() {
  return (
    <Card className="shadow-lg">
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
                className="h-20 flex flex-col gap-2 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-full ${action.bgColor} flex items-center justify-center`}>
                  <Icon size={20} className={action.color} />
                </div>
                <span className="text-sm">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
