import { useQuery } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchDashboard } from '@/api/dashboard.api';
import { toDashboardViewData } from '@/features/dashboard/adapters/toDashboardViewData';
import { QUERY_CONFIG } from '@/config/api';

const SCOPE = 'dashboard' as const;
const scoped = makeScopedKeys(SCOPE);
export const dashboardQueryKeys = {
    all: () => scoped.all(),
    recentRecords: () => scoped.nest('recentRecords'),
} as const;

/** サーバ応答 → View データを select で一度だけ変換 */
export const useDashboard = () =>
    useQuery({
        queryKey: dashboardQueryKeys.all(),
        queryFn: fetchDashboard,
        staleTime: QUERY_CONFIG.defaultStaleTimeMs,
        refetchOnWindowFocus: false,
        select: (data) => toDashboardViewData(data),
    });

/** MonthlyStatsCard 用：必要な断面だけ select */
export const useDashboardStats = () =>
    useQuery({
        queryKey: dashboardQueryKeys.all(),
        queryFn: fetchDashboard,
        staleTime: QUERY_CONFIG.defaultStaleTimeMs,
        refetchOnWindowFocus: false,
        select: (data) => toDashboardViewData(data).stats,
    });

/** RecentRecordsCard 用：必要な断面だけ select */
export const useRecentRecords = () =>
    useQuery({
        queryKey: dashboardQueryKeys.all(),
        queryFn: fetchDashboard,
        staleTime: QUERY_CONFIG.defaultStaleTimeMs,
        refetchOnWindowFocus: false,
        select: (data) => toDashboardViewData(data).recentRecords,
    });