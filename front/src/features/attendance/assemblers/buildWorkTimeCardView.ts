import { formatMinutes } from '@/shared/utils/format';

import type { WorkTimeCardView } from '@/features/attendance/ui/components/WorkTimeCard/WorkTimeCard.types';

export const buildWorkTimeCardView = (
    totalWorkedMinutes: number,
    breakMinutes: number,
    overtimeMinutes: number,
): WorkTimeCardView => ({
    totalWorkedTime: formatMinutes(totalWorkedMinutes),
    breakTime: formatMinutes(breakMinutes),
    overtimeTime: formatMinutes(overtimeMinutes),
});
