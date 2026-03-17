import type { ClockStatus } from '@/domain/time-attendance/attendance';

export type DashboardView = {
    clockStatus: ClockStatus;
    totalWorkedMs: number | null;
    startTime: string | null;
    endTime: string | null;
    workDate: string;
};