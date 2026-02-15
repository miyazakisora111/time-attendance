import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/atoms/CardComposite";
import { BarChart3, Clock, TrendingUp, Calendar } from "lucide-react";

const stats = [
  {
    icon: Clock,
    label: "今月の勤務時間",
    value: "168時間",
    subtext: "目標: 176時間",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Calendar,
    label: "出勤日数",
    value: "21日",
    subtext: "残り: 1日",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: TrendingUp,
    label: "平均勤務時間",
    value: "8.0時間",
    subtext: "前月比: +0.5時間",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: BarChart3,
    label: "残業時間",
    value: "12時間",
    subtext: "前月比: -3時間",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

export function MonthlyStatsCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">{stat.label}</CardTitle>
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
