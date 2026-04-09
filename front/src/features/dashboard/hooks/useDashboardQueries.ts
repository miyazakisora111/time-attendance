import { useQuery } from '@tanstack/react-query';

import { makeScopedKeys } from '@/lib/query/keys';
import { fetchDashboard } from '@/api/dashboard.api';

const SCOPE = 'dashboard' as const;
const scoped = makeScopedKeys(SCOPE);
export const dashboardQueryKeys = {
  all: () => scoped.all(),
} as const;

/** ダッシュボードデータを取得 */
export const useDashboard = () =>
  useQuery({
    queryKey: dashboardQueryKeys.all(),
    queryFn: fetchDashboard,
  });