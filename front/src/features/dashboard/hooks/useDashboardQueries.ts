import { useQuery } from '@tanstack/react-query';
import { makeScopedKeys } from '@/lib/query/keys';
import { fetchDashboard } from '@/api/dashboard.api';
import type { DashboardResponse } from '@/__generated__/model';
import { toDashboardViewData } from '@/features/dashboard/adapters/toDashboardViewData';

const SCOPE = 'dashboard' as const;
const scoped = makeScopedKeys(SCOPE);
export const dashboardQueryKeys = {
    all: () => scoped.all(),
} as const;

/** ダッシュボードデータを取得 */
export const useDashboard = () =>
    useQuery<DashboardResponse, Error, ReturnType<typeof toDashboardViewData>>({
        queryKey: dashboardQueryKeys.all(),
        queryFn: fetchDashboard,
        select: (data) => toDashboardViewData(data),
    });