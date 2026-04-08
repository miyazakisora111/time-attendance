import type { AttendanceResponse } from '@/__generated__/model';
import { overrideDefined } from '@/shared/mapper/object';
import type { Mapper } from '@/shared/mapper';

import type { AttendancePageView } from '@/features/attendance/ui/page/AttendancePageView';
import { attendancePageViewDefaults } from '@/features/attendance/ui/page/AttendancePageView';

export const toAttendancePageView: Mapper<
    AttendanceResponse,
    AttendancePageView
> = (src) =>
        overrideDefined(attendancePageViewDefaults, {
            clockStatus: src.clockStatus,
            clockInAt: src.clockInAt,
            clockOutAt: src.clockOutAt,
            workDate: src.workDate,
            totalWorkedMinutes: src.workedMinutes,
            breakMinutes: src.breakMinutes,
            overtimeMinutes: src.overtimeMinutes,
        });
