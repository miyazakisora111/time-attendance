import { getDashboard } from '@/__generated__/dashboard/dashboard';
import type { DashboardResponse, DashboardClockResponse } from '@/__generated__/model';
import type { ClockAction } from '@/domain/attendance/attendance';
import { call } from '@/shared/http/result';

const client = getDashboard();

/**
 * ダッシュボード情報を取得
 */
export const fetchDashboard = () => call<DashboardResponse>(() => client.getDashboardApi());

/**
 * 打刻アクションを実行
 */
export const clockInOut = (action: ClockAction) =>
  call<DashboardClockResponse>(() => client.postDashboardClockApi({ action }));

