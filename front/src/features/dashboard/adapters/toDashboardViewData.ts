import type { DashboardResponse, DashboardResponseClockStatus } from "@/__generated__/model";
import type { DashboardViewData } from "@/features/dashboard/ui/types";

/**
 * API応答をダッシュボード表示用データに変換
 */
export const toDashboardViewData = (
  response: DashboardResponse,
): DashboardViewData => ({
  user: {
    id: response.user.id,
    name: response.user.name,
  },
  clockStatus: response.clockStatus as DashboardResponseClockStatus,
  todayRecord: {
    clockInTime: response.todayRecord.clockInTime,
    totalWorkedHours: response.todayRecord.totalWorkedHours,
  },
  recentRecords: response.recentRecords.map((record) => ({
    date: record.date,
    day: record.day,
    clockIn: record.clockIn,
    clockOut: record.clockOut,
    workHours: record.workHours,
    status: record.status,
  })),
  stats: {
    totalHours: response.stats.totalHours,
    targetHours: response.stats.targetHours,
    workDays: response.stats.workDays,
    remainingDays: response.stats.remainingDays,
    avgHours: response.stats.avgHours,
    avgHoursDiff: response.stats.avgHoursDiff,
    overtimeHours: response.stats.overtimeHours,
    overtimeDiff: response.stats.overtimeDiff,
  },
  pendingOvertimeRequests: response.pendingOvertimeRequests,
});
