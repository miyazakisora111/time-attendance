import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDashboard,
  clockInOut,
} from "@/features/dashboard/api/dashboardApi";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  data: () => [...dashboardQueryKeys.all, "data"] as const,
  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
  recentRecords: () => [...dashboardQueryKeys.all, "recentRecords"] as const,
};

export function useDashboardData() {
  return useQuery({
    queryKey: dashboardQueryKeys.data(),
    queryFn: fetchDashboard,
    staleTime: 1000 * 60,
  });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clockInOut,
    onSuccess: (result) => {
      queryClient.setQueryData(dashboardQueryKeys.data(), result.dashboard);
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
    },
  });
}

