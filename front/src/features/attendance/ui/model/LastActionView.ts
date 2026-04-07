import type { ClockAction } from '@/__generated__/enums';

/** 直近打刻 */
export interface LastActionView {
    clockAction: ClockAction;
    label: string;
    time: string;
}
