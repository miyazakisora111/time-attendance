import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { History, Clock, AlertCircle } from "lucide-react";
import { useRecentRecords } from "@/features/dashboard/model/useDashboard";
import { Spinner } from "@/shared/components/Spinner";

export const RecentRecordsCard = React.memo(function RecentRecordsCard() {
  const { data: records, isLoading, isError } = useRecentRecords();

  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="text-blue-600" />
          最近の勤怠記録
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8 min-h-[200px]">
            <Spinner size="md" className="text-blue-600" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg text-red-600 gap-2 min-h-[200px]">
            <AlertCircle size={24} />
            <p className="font-medium text-sm">データの取得に失敗しました</p>
          </div>
        ) : !records || records.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500 gap-2 min-h-[200px]">
            <History size={32} className="text-gray-300" />
            <p className="font-medium text-sm">勤怠記録がありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left font-medium py-3 px-2 text-gray-500">日付</th>
                  <th className="text-left font-medium py-3 px-2 text-gray-500">出勤</th>
                  <th className="text-left font-medium py-3 px-2 text-gray-500">退勤</th>
                  <th className="text-left font-medium py-3 px-2 text-gray-500">勤務時間</th>
                  <th className="text-left font-medium py-3 px-2 text-gray-500">状態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <Clock size={14} className="text-gray-400" />
                        {record.date}
                        <span className="text-gray-500 text-xs">({record.day})</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-700">{record.clockIn || "-"}</td>
                    <td className="py-3 px-2 text-gray-700">{record.clockOut || "-"}</td>
                    <td className="py-3 px-2 text-gray-700">
                      {record.workHours !== null ? `${record.workHours}h` : "-"}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          record.status === "通常"
                            ? "bg-green-100/80 text-green-700"
                            : record.status === "残業"
                            ? "bg-orange-100/80 text-orange-700"
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
        )}
      </CardContent>
    </Card>
  );
});
