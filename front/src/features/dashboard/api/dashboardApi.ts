/**
 * Dashboard API (Mock)
 * 
 * Handles API calls for dashboard data
 */

// Delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface DashboardStats {
  totalHours: number;
  targetHours: number;
  workDays: number;
  remainingDays: number;
  avgHours: number;
  avgHoursDiff: number;
  overtimeHours: number;
  overtimeDiff: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(800); // simulate network latency
  return {
    totalHours: 168,
    targetHours: 176,
    workDays: 21,
    remainingDays: 1,
    avgHours: 8.0,
    avgHoursDiff: 0.5,
    overtimeHours: 12,
    overtimeDiff: -3,
  };
}

export interface AttendanceRecord {
  date: string;
  day: string;
  clockIn: string | null;
  clockOut: string | null;
  workHours: number | null;
  status: "通常" | "残業" | "休日";
}

export async function fetchAttendanceRecords(): Promise<AttendanceRecord[]> {
  await delay(1000); // simulate network latency
  return [
    { date: "2025/12/16", day: "月", clockIn: "09:00", clockOut: "18:30", workHours: 8.5, status: "通常" },
    { date: "2025/12/15", day: "日", clockIn: null, clockOut: null, workHours: null, status: "休日" },
    { date: "2025/12/14", day: "土", clockIn: null, clockOut: null, workHours: null, status: "休日" },
    { date: "2025/12/13", day: "金", clockIn: "09:05", clockOut: "19:00", workHours: 9.0, status: "残業" },
    { date: "2025/12/12", day: "木", clockIn: "09:00", clockOut: "18:00", workHours: 8.0, status: "通常" },
    { date: "2025/12/11", day: "水", clockIn: "09:00", clockOut: "18:15", workHours: 8.2, status: "通常" },
  ];
}

export async function clockInOut(action: 'in' | 'out' | 'break_start' | 'break_end') {
  await delay(500); // simulate network latency
  return {
    success: true,
    action,
    timestamp: new Date().toISOString()
  };
}
