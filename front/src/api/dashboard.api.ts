import { getDashboard } from '@/__generated__/dashboard/dashboard';
import type { DashboardResponse } from '@/__generated__/model';
import { call } from '@/lib/http/result';

const client = getDashboard();

/**
 * ダッシュボード情報を取得
 */
export const fetchDashboard = () => call<DashboardResponse>(() => client.getDashboard());