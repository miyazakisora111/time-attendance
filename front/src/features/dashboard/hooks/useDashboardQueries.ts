import { useQuery } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchDashboard } from '@/api/dashboard.api';
import type { DashboardResponse } from '@/__generated__/model';
import { toDashboardViewData } from '@/features/dashboard/adapters/toDashboardViewData';
import type { DashboardViewData } from '@/features/dashboard/ui/types';

const SCOPE = 'dashboard' as const;
const scoped = makeScopedKeys(SCOPE);
export const dashboardQueryKeys = {
  all: () => scoped.all(),
} as const;

const selectDashboard = (data: DashboardResponse): DashboardViewData => toDashboardViewData(data);

/** ダッシュボードデータを取得 */
export const useDashboard = () =>
  useQuery<DashboardResponse, Error, DashboardViewData>({
    queryKey: dashboardQueryKeys.all(),
    queryFn: fetchDashboard,
    select: selectDashboard,
  });

/** 月次統計のみ取得 */
export const useDashboardStats = () =>
  useQuery<DashboardResponse, Error, DashboardViewData['stats']>({
    queryKey: dashboardQueryKeys.all(),
    queryFn: fetchDashboard,
    select: (data) => selectDashboard(data).stats,
  });

/** 直近勤怠のみ取得 */
export const useRecentRecords = () =>
  useQuery<DashboardResponse, Error, DashboardViewData['recentRecords']>({
    queryKey: dashboardQueryKeys.all(),
    queryFn: fetchDashboard,
    select: (data) => selectDashboard(data).recentRecords,
  });