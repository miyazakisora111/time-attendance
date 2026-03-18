import type { AttendanceResponse } from '@/__generated__/model';
import type { AttendanceView } from '@/features/attendance/ui/types';

export const toAttendanceView = (src: AttendanceResponse): AttendanceView => {
    const start = src.start_time ?? null;
    const end = src.end_time ?? null;

    return {
        clockAction: start && !end ? 'in' : 'out',
        totalWorkedMs: start && end ? new Date(end).getTime() - new Date(start).getTime() : null,
        startTime: start,
        endTime: end,
        workDate: src.work_date,
    };
};