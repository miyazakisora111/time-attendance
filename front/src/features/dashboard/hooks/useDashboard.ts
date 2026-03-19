import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { clockIn, clockOut } from '@/api/attendance.api';
import { fetchDashboard } from '@/api/dashboard.api';
import type { DashboardResponse } from '@/__generated__/model';
import { QUERY_CONFIG } from '@/config/api';

/**
 * React Query キー。
 */
const SCOPE = 'dashboard' as const;
const scoped = makeScopedKeys(SCOPE);
export const dashboardQueryKeys = {
  all: () => scoped.all(),
  clockIn: () => scoped.nest('clockIn'),
  clockOut: () => scoped.nest('clockOut'),
} as const;

/**
 * ダッシュボード情報を取得
 */
export const useDashboard = () => {
  return useQuery<DashboardResponse>({
    queryKey: dashboardQueryKeys.all(),
    queryFn: fetchDashboard,
    staleTime: QUERY_CONFIG.defaultStaleTimeMs,
    refetchOnWindowFocus: false,
  });
};

/** 
 * 出勤打刻 
 */
export const useClockIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: dashboardQueryKeys.clockIn(),
    mutationFn: (payload: { start_time: string, work_date: string }) => clockIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all() });
    },
  });
};

/** 
 * 退勤打刻 
 */
export const useClockOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: dashboardQueryKeys.clockOut(),
    mutationFn: (payload: { end_time: string, work_date: string }) => clockOut(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all() });
    },
  });
};