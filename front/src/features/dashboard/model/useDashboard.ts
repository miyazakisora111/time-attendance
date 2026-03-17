import {
  attendanceQueryKeys,
  useAttendanceClockAction,
  useAttendanceDashboard,
} from "@/features/attendance/hooks/useAttendanceData";

export const dashboardQueryKeys = {
  all: attendanceQueryKeys.all,
  data: attendanceQueryKeys.dashboard,
  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
  recentRecords: () => [...dashboardQueryKeys.all, "recentRecords"] as const,
};

/**
 * ダッシュボードデータを取得する。
 */
export function useGetDashboardData() {
  return useAttendanceDashboard();
}

/**
 * ダッシュボード統計情報を取得する。
 */
export function useGetDashboardStats() {
  const query = useGetDashboardData();

  return {
    ...query,
    data: query.data?.stats,
  };
}

/**
 * 最近の勤怠記録を取得する。
 */
export function useGetRecentRecords() {
  const query = useGetDashboardData();

  return {
    ...query,
    data: query.data?.recentRecords,
  };
}

/**
 * 打刻アクションを作成する。
 */
export function useCreateClockInOut() {
  return useAttendanceClockAction();
}

// 互換エクスポート
export const useDashboardData = useGetDashboardData;
export const useDashboardStats = useGetDashboardStats;
export const useRecentRecords = useGetRecentRecords;
export const useClockInOut = useCreateClockInOut;

