import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/atoms/CardComposite";
import { History, Clock } from "lucide-react";

const recentRecords = [
  { date: "2025/12/16", day: "月", clockIn: "09:00", clockOut: "18:30", workHours: "8.5", status: "通常" },
  { date: "2025/12/15", day: "日", clockIn: "-", clockOut: "-", workHours: "-", status: "休日" },
  { date: "2025/12/14", day: "土", clockIn: "-", clockOut: "-", workHours: "-", status: "休日" },
  { date: "2025/12/13", day: "金", clockIn: "09:05", clockOut: "19:00", workHours: "9.0", status: "残業" },
  { date: "2025/12/12", day: "木", clockIn: "09:00", clockOut: "18:00", workHours: "8.0", status: "通常" },
  { date: "2025/12/11", day: "水", clockIn: "09:00", clockOut: "18:15", workHours: "8.2", status: "通常" },
];

export function RecentRecordsCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="text-blue-600" />
          最近の勤怠記録
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 text-gray-600">日付</th>
                <th className="text-left py-3 px-2 text-gray-600">出勤</th>
                <th className="text-left py-3 px-2 text-gray-600">退勤</th>
                <th className="text-left py-3 px-2 text-gray-600">勤務時間</th>
                <th className="text-left py-3 px-2 text-gray-600">状態</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record, index) => (
                <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {record.date}
                      <span className="text-gray-500">({record.day})</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">{record.clockIn}</td>
                  <td className="py-3 px-2">{record.clockOut}</td>
                  <td className="py-3 px-2">
                    {record.workHours !== "-" && `${record.workHours}h`}
                    {record.workHours === "-" && record.workHours}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        record.status === "通常"
                          ? "bg-green-100 text-green-700"
                          : record.status === "残業"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
