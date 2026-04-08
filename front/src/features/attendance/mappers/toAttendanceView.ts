import type { AttendanceResponse } from '@/__generated__/model';
import { overrideDefined } from '@/shared/mapper/object';
import type { Mapper } from '@/shared/mapper';

import type { AttendanceView } from '@/features/attendance/types/AttendanceView';
import { attendanceViewDefaults } from '@/features/attendance/types/AttendanceView';

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
