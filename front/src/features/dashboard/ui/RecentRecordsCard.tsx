import React from "react";
import { motion } from "framer-motion";
import { Clock, History } from "lucide-react";

import { isCrossDayShiftByClock } from "@/domain/attendance/time";
import { AsyncDataState } from "@/shared/components/states/AsyncDataState";
import { Badge, Card, CardContent, CardHeader, CardTitle, Typography } from "@/shared/components";
import { formatClockText, formatHoursText } from "@/shared/utils/format";
import { getAttendanceStatusBadgeIntent } from "@/shared/presentation/attendance/attendanceStatus";
import { fadeUp } from "@/shared/animations/presets";
import { stagger } from "@/shared/animations/stagger";
import { transitionNormal } from "@/shared/animations/transitions";

import { useRecentRecords } from "@/features/dashboard/hooks/useDashboardQueries";

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
        <AsyncDataState
          isLoading={isLoading}
          isError={isError}
          isEmpty={!records || records.length === 0}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100/50">
                  {['日付', '出勤', '退勤', '勤務時間', '状態'].map((label) => (
                    <th key={label} className="px-3 py-4 text-left">
                      <Typography variant="caption" unstableClassName="text-[10px] uppercase tracking-wider">
                        {label}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              <motion.tbody
                className="divide-y divide-gray-50"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                {records?.map((record) => (
                  <motion.tr
                    key={`${record.date}-${record.day}`}
                    className="group transition-colors hover:bg-blue-50/30"
                    variants={fadeUp}
                    transition={transitionNormal}
                  >
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
                      <Badge intent={getAttendanceStatusBadgeIntent(record.status as never)}>
                        {record.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </AsyncDataState>
      </CardContent>
    </Card>
  );
});
