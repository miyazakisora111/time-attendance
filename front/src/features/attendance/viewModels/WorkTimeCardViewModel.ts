import { formatMinutes } from '@/shared/utils/format';

/** 勤務時間カードの表示用データ */
export interface WorkTimeCardView {
    totalWorkedTime: string;
    breakTime: string;
    overtimeTime: string;
}

export const createWorkTimeCardView = (
    totalWorkedMinutes: number,
    breakMinutes: number,
    overtimeMinutes: number,
): WorkTimeCardView => ({
    totalWorkedTime: formatMinutes(totalWorkedMinutes),
    breakTime: formatMinutes(breakMinutes),
    overtimeTime: formatMinutes(overtimeMinutes),
});
