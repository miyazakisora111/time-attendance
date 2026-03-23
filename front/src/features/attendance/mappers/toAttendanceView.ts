import type { AttendanceResponse } from '@/__generated__/model';
import type { AttendanceView } from '@/features/attendance/ui/types';
import { calculateWorkedMinutes } from '@/domain/attendance/time';
import type { Mapper } from "@/shared/mapper";

export const toAttendanceView: Mapper<
    AttendanceResponse,
    AttendanceView
> = (src) => {
    const startTime = src.startTime ?? null;
    const endTime = src.endTime ?? null;

    return {
        clockStatus: src.clockStatus ?? 'out',
        totalWorkedMinutes: calculateWorkedMinutes(startTime, endTime),
        breakMinutes: src.breakMinutes ?? null,
        startTime: startTime,
        endTime: endTime,
        workDate: src.workDate,
    };
};