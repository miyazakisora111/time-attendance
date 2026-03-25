import type { AttendanceResponse } from '@/__generated__/model';
import type { AttendanceView } from '@/features/attendance/ui/types';
import { calculateWorkedMinutes } from '@/domain/attendance/time';
import type { Mapper } from "@/shared/mapper";

export const toAttendanceView: Mapper<
    AttendanceResponse,
    AttendanceView
> = (src) => {
    const clockInAt = src.clockInAt ?? null;
    const clockOutAt = src.clockOutAt ?? null;

    return {
        clockStatus: src.clockStatus ?? 'out',
        totalWorkedMinutes: calculateWorkedMinutes(clockInAt, clockOutAt),
        breakMinutes: src.breakMinutes ?? null,
        clockInAt: clockInAt,
        clockOutAt: clockOutAt,
        workDate: src.workDate,
    };
};