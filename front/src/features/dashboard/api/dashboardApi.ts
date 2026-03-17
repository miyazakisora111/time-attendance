import { getDashboard } from "@/__generated__/dashboard/dashboard";
import type {
  DashboardClockResponse,
  DashboardResponse,
} from "@/__generated__/model";
import type { ClockAction } from "@/domain/time-attendance/clock-action";
import { unwrapApiEnvelope } from "@/shared/http/result/envelope";

export type DashboardData = DashboardResponse;
export type DashboardStats = DashboardResponse["stats"];
export type AttendanceRecord = DashboardResponse["recentRecords"][number];

/**
 * ダッシュボード表示用データを取得する。
 */
export async function fetchDashboard(): Promise<DashboardData> {
  const response = await getDashboard().getDashboardApi();

  return unwrapApiEnvelope<DashboardData>(response);
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data = await fetchDashboard();

  return data.stats;
}

export async function fetchAttendanceRecords(): Promise<AttendanceRecord[]> {
  const data = await fetchDashboard();

  return data.recentRecords;
}

/**
 * 打刻アクションを実行し、更新後のダッシュボード情報を返す。
 */
export async function clockInOut(action: ClockAction): Promise<DashboardClockResponse> {
  const response = await getDashboard().postDashboardClockApi({ action });

  return unwrapApiEnvelope<DashboardClockResponse>(response);
}

