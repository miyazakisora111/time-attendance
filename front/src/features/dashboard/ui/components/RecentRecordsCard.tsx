import React from "react";
import { Card, CardContent, CardHeader, CardTitle, Typography, Badge } from "@/shared/components";
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
            <Typography variant="label">データの取得に失敗しました</Typography>
          </div>
        ) : !records || records.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500 gap-2 min-h-[200px]">
            <History size={32} className="text-gray-300" />
            <Typography variant="label">勤怠記録がありません</Typography>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100/50 hover:bg-transparent">
                  <th className="text-left font-bold py-4 px-3"><Typography variant="label" className="text-gray-400 uppercase tracking-wider text-[10px]">日付</Typography></th>
                  <th className="text-left font-bold py-4 px-3"><Typography variant="label" className="text-gray-400 uppercase tracking-wider text-[10px]">出勤</Typography></th>
                  <th className="text-left font-bold py-4 px-3"><Typography variant="label" className="text-gray-400 uppercase tracking-wider text-[10px]">退勤</Typography></th>
                  <th className="text-left font-bold py-4 px-3"><Typography variant="label" className="text-gray-400 uppercase tracking-wider text-[10px]">勤務時間</Typography></th>
                  <th className="text-left font-bold py-4 px-3"><Typography variant="label" className="text-gray-400 uppercase tracking-wider text-[10px]">状態</Typography></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map((record, index) => (
                  <tr key={index} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-3 font-medium">
                      <div className="flex items-center gap-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                        <Clock size={14} className="text-gray-300" />
                        {record.date}
                        <Typography variant="small" className="text-gray-400">({record.day})</Typography>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-gray-700 font-bold tabular-nums">{record.clockIn || "-"}</td>
                    <td className="py-4 px-3 text-gray-700 font-bold tabular-nums">{record.clockOut || "-"}</td>
                    <td className="py-4 px-3 text-gray-700 font-bold tabular-nums">
                      {record.workHours !== null ? `${record.workHours}h` : "-"}
                    </td>
                    <td className="py-4 px-3">
                      <Badge 
                        intent={record.status === "通常" ? "success" : record.status === "残業" ? "warning" : "default"}
                      >
                        {record.status}
                      </Badge>
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
