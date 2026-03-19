import React from "react";
import { AlertCircle, Clock, History } from "lucide-react";
import { isCrossDayShiftByClock } from "@/domain/attendance/time";
import { Badge, Card, CardContent, CardHeader, CardTitle, Spinner, Typography } from "@/shared/components";
import { useRecentRecords } from "@/features/dashboard/hooks/useDashboardQueries";
import { formatClockText, formatHoursText } from "@/shared/presentation/format";
import { getAttendanceRecordStatusBadgeIntent } from "@/shared/presentation/attendance";

/**
 * 最近の勤怠記録を一覧表示するコンポーネント。
 */
export const RecentRecordsCard = React.memo(function RecentRecordsCard() {
  const { data: records, isLoading, isError } = useRecentRecords();

  return (
    <Card>
      <CardHeader>
        <CardTitle unstableClassName="flex items-center gap-2">
          <History className="text-blue-600" />
          最近の勤怠記録
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner size="md" unstableClassName="text-blue-600" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-red-50 p-8 text-red-600">
            <AlertCircle size={24} />
            <Typography variant="label">データの取得に失敗しました</Typography>
          </div>
        ) : !records || (Array.isArray(records) && records.length === 0) ? (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-gray-500">
            <History size={32} className="text-gray-300" />
            <Typography variant="label">勤怠記録がありません</Typography>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100/50">
                  <th className="px-3 py-4 text-left">
                    <Typography variant="label" unstableClassName="text-[10px] uppercase tracking-wider text-gray-400">
                      日付
                    </Typography>
                  </th>
                  <th className="px-3 py-4 text-left">
                    <Typography variant="label" unstableClassName="text-[10px] uppercase tracking-wider text-gray-400">
                      出勤
                    </Typography>
                  </th>
                  <th className="px-3 py-4 text-left">
                    <Typography variant="label" unstableClassName="text-[10px] uppercase tracking-wider text-gray-400">
                      退勤
                    </Typography>
                  </th>
                  <th className="px-3 py-4 text-left">
                    <Typography variant="label" unstableClassName="text-[10px] uppercase tracking-wider text-gray-400">
                      勤務時間
                    </Typography>
                  </th>
                  <th className="px-3 py-4 text-left">
                    <Typography variant="label" unstableClassName="text-[10px] uppercase tracking-wider text-gray-400">
                      状態
                    </Typography>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {records?.map((record) => (
                  <tr key={`${record.date}-${record.day}`} className="group transition-colors hover:bg-blue-50/30">
                    <td className="px-3 py-4 font-medium">
                      <div className="flex items-center gap-2 text-gray-900 transition-colors group-hover:text-blue-600">
                        <Clock size={14} className="text-gray-300" />
                        {record.date}
                        <Typography variant="small" intent="muted">
                          ({record.day})
                        </Typography>
                      </div>
                    </td>
                    <td className="px-3 py-4 font-semibold tabular-nums text-gray-700">{formatClockText(record.clockIn)}</td>
                    <td className="px-3 py-4 font-semibold tabular-nums text-gray-700">
                      {formatClockText(record.clockOut)}
                      {isCrossDayShiftByClock(record.clockIn, record.clockOut) ? (
                        <Typography variant="small" intent="muted" unstableClassName="ml-1 inline-block">
                          (翌日)
                        </Typography>
                      ) : null}
                    </td>
                    <td className="px-3 py-4 font-semibold tabular-nums text-gray-700">
                      {formatHoursText(record.workHours)}
                    </td>
                    <td className="px-3 py-4">
                      <Badge intent={getAttendanceRecordStatusBadgeIntent(record.status as never)}>
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
