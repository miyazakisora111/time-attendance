import type { DashboardRecentRecord } from '@/__generated__/model';
import { isCrossDayShiftByClock } from '@/domain/attendance/time';
import { formatClockText, formatHoursText } from '@/shared/utils/format';
import { getAttendanceStatusBadgeIntent } from '@/shared/presentation/attendance/attendanceStatus';

export interface RecentRecordRowView {
    key: string;
    date: string;
    day: string;
    clockInText: string;
    clockOutText: string;
    isCrossDay: boolean;
    workHoursText: string;
    status: string;
    statusBadgeIntent: ReturnType<typeof getAttendanceStatusBadgeIntent>;
}

export const buildRecentRecordsView = (
    records: ReadonlyArray<DashboardRecentRecord>,
): RecentRecordRowView[] =>
    records.map((r) => ({
        key: `${r.date}-${r.day}`,
        date: r.date,
        day: r.day,
        clockInText: formatClockText(r.clockIn),
        clockOutText: formatClockText(r.clockOut),
        isCrossDay: isCrossDayShiftByClock(r.clockIn, r.clockOut),
        workHoursText: formatHoursText(r.workHours),
        status: r.status,
        statusBadgeIntent: getAttendanceStatusBadgeIntent(r.status),
    }));
