import type { AttendanceResponse } from '@/__generated__/model';
import type { AttendanceView } from '@/features/attendance/ui/types';
import type { Mapper } from "@/shared/mapper";

export const toAttendanceView: Mapper<
    AttendanceResponse,
    AttendanceView
> = (src) => {
    return {
        clockStatus: src.clockStatus,
        totalWorkedMinutes: src.workedMinutes,
        breakMinutes: src.breakMinutes,
        clockInAt: src.clockInAt,
        clockOutAt: src.clockOutAt,
        workDate: src.workDate,
    };
};