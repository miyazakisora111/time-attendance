import type { AttendanceResponse } from '@/__generated__/model';
import type { DashboardView } from './types';

export const toDashboardView = (src: AttendanceResponse): DashboardView => {
    const start = src.start_time ?? null;
    const end = src.end_time ?? null;

    return {
        clockStatus: start && !end ? 'in' : 'out',
        totalWorkedMs: start && end ? new Date(end).getTime() - new Date(start).getTime() : null,
        startTime: start,
        endTime: end,
        workDate: src.work_date,
    };
};