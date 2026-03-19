import { useQuery } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchDashboard } from '@/api/dashboard.api';
import type { DashboardResponse } from '@/__generated__/model';
import { toDashboardViewData } from '@/features/dashboard/adapters/toDashboardViewData';

const SCOPE = 'dashboard' as const;
const scoped = makeScopedKeys(SCOPE);
export const dashboardQueryKeys = {
    all: () => scoped.all(),
    stats: () => scoped.nest('stats'),
    recentRecords: () => scoped.nest('recentRecords'),
} as const;

/** サーバ応答 → View データを select で一度だけ変換 */
export const useDashboardData = () =>
    useQuery<DashboardResponse, Error, ReturnType<typeof toDashboardViewData>>({
        queryKey: dashboardQueryKeys.all(),
        queryFn: fetchDashboard,
        select: (data) => toDashboardViewData(data),
    });

/** MonthlyStatsCard 用：必要な断面だけ select */
export const useDashboardStats = () =>
    useQuery<DashboardResponse, Error, ReturnType<typeof toDashboardViewData>['stats']>({
        queryKey: dashboardQueryKeys.all(),
        queryFn: fetchDashboard,
        select: (data) => toDashboardViewData(data).stats,
    });

/** RecentRecordsCard 用：必要な断面だけ select */
export const useRecentRecords = () =>
    useQuery<DashboardResponse, Error, ReturnType<typeof toDashboardViewData>['recentRecords']>({
        queryKey: dashboardQueryKeys.all(),
        queryFn: fetchDashboard,
        select: (data) => toDashboardViewData(data).recentRecords,
    });