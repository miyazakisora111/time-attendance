import type { AttendanceResponse } from '@/__generated__/model';
import { resolveClockAction } from '@/domain/attendance/attendance';
import type { AttendanceView } from '@/features/attendance/ui/types';
import { calculateWorkedMinutes } from '@/domain/attendance/time';
import type { Mapper } from "@/shared/mapper";

export const toAttendanceView: Mapper<
    AttendanceResponse,
    AttendanceView
> = (src) => {
    const startTime = src.start_time ?? null;
    const endTime = src.end_time ?? null;

    return {
        clockAction: resolveClockAction(startTime, endTime),
        totalWorkedMinutes: calculateWorkedMinutes(startTime, endTime),
        breakMinutes: src.break_minutes ?? null,
        startTime: startTime,
        endTime: endTime,
        workDate: src.work_date,
    };
};