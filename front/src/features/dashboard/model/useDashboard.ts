import {
  attendanceQueryKeys,
  useAttendanceClockAction,
  useAttendanceDashboardData,
} from "@/features/attendance/hooks/useAttendanceData";

export const dashboardQueryKeys = {
  all: attendanceQueryKeys.all,
  data: attendanceQueryKeys.dashboard,
  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
  recentRecords: () => [...dashboardQueryKeys.all, "recentRecords"] as const,
};

export function useDashboardData() {
  return useAttendanceDashboardData();
}

export function useDashboardStats() {
  const query = useDashboardData();

  return {
    ...query,
    data: query.data?.stats,
  };
}

export function useRecentRecords() {
  const query = useDashboardData();

  return {
    ...query,
    data: query.data?.recentRecords,
  };
}

export function useClockInOut() {
  return useAttendanceClockAction();
}

