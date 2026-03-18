import {
  dashboardQueryKeys,
  useClockInOut,
  useGetDashboard,
  useGetDashboardStats,
  useGetRecentRecords,
} from '@/features/dashboard/hooks/useDashboard';

export {
  dashboardQueryKeys,
  useGetDashboard,
  useGetDashboardStats,
  useGetRecentRecords,
  useClockInOut,
};

// 互換エクスポート
export const useDashboardData = useGetDashboard;
export const useDashboardStats = useGetDashboardStats;
export const useRecentRecords = useGetRecentRecords;
export const useCreateClockInOut = useClockInOut;

