import { getDashboard } from "@/api/__generated__/dashboard/dashboard";
import type {
  DashboardClockRequestAction,
  DashboardClockResponse,
  DashboardResponse,
} from "@/api/__generated__/model";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
};

const unwrapResponse = <T>(payload: T | ApiEnvelope<T>): T => {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    "success" in payload
  ) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
};

export type DashboardData = DashboardResponse;
export type DashboardStats = DashboardResponse["stats"];
export type AttendanceRecord = DashboardResponse["recentRecords"][number];
export type ClockAction = DashboardClockRequestAction;

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await getDashboard().getDashboardApi();

  return unwrapResponse<DashboardData>(response);
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data = await fetchDashboard();

  return data.stats;
}

export async function fetchAttendanceRecords(): Promise<AttendanceRecord[]> {
  const data = await fetchDashboard();

  return data.recentRecords;
}

export async function clockInOut(action: ClockAction): Promise<DashboardClockResponse> {
  const response = await getDashboard().postDashboardClockApi({ action });

  return unwrapResponse<DashboardClockResponse>(response);
}

