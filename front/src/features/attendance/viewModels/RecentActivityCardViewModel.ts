import type { ClockAction } from '@/__generated__/enums';

/** 直近打刻の表示用データ */
export interface RecentActivityCardView {
    clockAction: ClockAction;
    label: string;
    time: string;
}
