import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clockInOut, fetchDashboard } from '@/features/dashboard/api/dashboardApi';

export const attendanceQueryKeys = {
  all: ['attendance-dashboard'] as const,
  dashboard: () => [...attendanceQueryKeys.all, 'dashboard'] as const,
};

export const useAttendanceDashboardData = () => {
  return useQuery({
    queryKey: attendanceQueryKeys.dashboard(),
    queryFn: fetchDashboard,
    staleTime: 1000 * 60,
  });
};

export const useAttendanceClockAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clockInOut,
    onSuccess: (result) => {
      queryClient.setQueryData(attendanceQueryKeys.dashboard(), result.dashboard);
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.all });
    },
  });
};
