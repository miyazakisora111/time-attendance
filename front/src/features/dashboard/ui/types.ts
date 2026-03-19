import type { ClockStatus } from "@/domain/attendance/attendance";

/**
 * ダッシュボードの表示用データモデル
 */

/** ユーザー情報 */
export interface DashboardUser {
  id: string;
  name: string;
}

/** 本日の記録 */
export interface DashboardTodayRecord {
  clockInTime: string | null;
  totalWorkedHours: number | null;
}

/** 最近の勤怠記録 */
export interface DashboardRecentRecord {
  date: string;
  day: string;
  clockIn: string | null;
  clockOut: string | null;
  workHours: number | null;
  status: string;
}

/** 月別統計 */
export interface DashboardStats {
  totalHours: number;
  workDays: number;
  avgHours: number;
  overtimeHours: number;
}

/** ダッシュボードの統合データ */
export interface DashboardViewData {
  user: DashboardUser;
  clockStatus: ClockStatus;
  todayRecord: DashboardTodayRecord;
  recentRecords: DashboardRecentRecord[];
  stats: DashboardStats;
  pendingOvertimeRequests: number;
}
