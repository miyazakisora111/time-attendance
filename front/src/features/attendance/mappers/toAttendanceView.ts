import type { AttendanceResponse } from '@/__generated__/model';
import type { AttendanceView } from '@/features/attendance/ui/types';
import type { Mapper } from '@/shared/mapper';

export const toAttendanceView: Mapper<
    AttendanceResponse,
    AttendanceView
> = (src) => {
    return {
        clockStatus: src.clockStatus ?? 'out',
        clockInAt: src.clockInAt ?? null,
        clockOutAt: src.clockOutAt ?? null,
        workDate: src.workDate ?? '',
        breakMinutes: src.breakMinutes ?? 0,
        totalWorkedMinutes: src.workedMinutes ?? 0,
        overtimeMinutes: src.overtimeMinutes ?? 0,
    };
};