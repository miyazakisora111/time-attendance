import { useQuery } from '@tanstack/react-query';

import { makeScopedKeys } from '@/lib/query/keys';
import type { DashboardRecentRecord, DashboardResponse, DashboardStats } from '@/__generated__/model';
import { fetchDashboard } from '@/api/dashboard.api';

import { toDashboardView } from '@/features/dashboard/mappers/toDashboardView';
import type { DashboardViewData } from '@/features/dashboard/types/DashboardViewData';

const SCOPE = 'dashboard' as const;
const scoped = makeScopedKeys(SCOPE);
export const dashboardQueryKeys = {
  all: () => scoped.all(),
} as const;

const selectDashboard = (data: DashboardResponse): DashboardViewData => toDashboardView(data);

/** ダッシュボードデータを取得 */
export const useDashboard = () =>
  useQuery<DashboardResponse, Error, DashboardViewData>({
    queryKey: dashboardQueryKeys.all(),
    queryFn: fetchDashboard,
    select: selectDashboard,
  });

/** 月次統計のみ取得 */
export const useDashboardStats = () =>
  useQuery<DashboardResponse, Error, DashboardStats>({
    queryKey: dashboardQueryKeys.all(),
    queryFn: fetchDashboard,
    select: (data) => selectDashboard(data).stats,
  });

/** 直近勤怠のみ取得 */
export const useRecentRecords = () =>
  useQuery<DashboardResponse, Error, DashboardRecentRecord[]>({
    queryKey: dashboardQueryKeys.all(),
    queryFn: fetchDashboard,
    select: (data) => selectDashboard(data).recentRecords,
  });