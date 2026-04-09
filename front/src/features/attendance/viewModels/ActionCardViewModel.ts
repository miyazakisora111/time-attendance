import type { ClockStatus } from '@/__generated__/enums';

/** アクションカードの表示用データ */
export interface ActionCardView {
    clockStatus: ClockStatus;
    isPending: boolean;
}
