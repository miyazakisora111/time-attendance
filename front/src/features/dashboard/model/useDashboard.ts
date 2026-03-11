import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDashboardStats, fetchAttendanceRecords, clockInOut } from "../api/dashboardApi";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
  recentRecords: () => [...dashboardQueryKeys.all, "recentRecords"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRecentRecords() {
  return useQuery({
    queryKey: dashboardQueryKeys.recentRecords(),
    queryFn: fetchAttendanceRecords,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useClockInOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clockInOut,
    onSuccess: () => {
      // Invalidate both stats and recent records to refresh the data
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
    },
  });
}
