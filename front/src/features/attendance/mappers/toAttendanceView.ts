import type { AttendanceResponse } from '@/__generated__/model';
import type { AttendanceView } from '@/features/attendance/types';
import { attendanceViewDefaults } from '@/features/attendance/types';
import { overrideDefined } from '@/shared/mapper/object';
import type { Mapper } from '@/shared/mapper';

export const toAttendanceView: Mapper<
    AttendanceResponse,
    AttendanceView
> = (src) =>
        overrideDefined(attendanceViewDefaults, {
            clockStatus: src.clockStatus,
            clockInAt: src.clockInAt,
            clockOutAt: src.clockOutAt,
            workDate: src.workDate,
            totalWorkedMinutes: src.workedMinutes,
            breakMinutes: src.breakMinutes,
            overtimeMinutes: src.overtimeMinutes,
        });
