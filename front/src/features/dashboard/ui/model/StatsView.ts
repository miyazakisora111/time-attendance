/** 月別統計 */
export interface StatsView {
    totalHours: number;
    targetHours: number;
    workDays: number;
    remainingDays: number;
    avgHours: number;
    avgHoursDiff: number;
    overtimeHours: number;
    overtimeDiff: number;
}