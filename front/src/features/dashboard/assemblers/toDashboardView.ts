import type { DashboardResponse } from "@/__generated__/model";
import type { Mapper } from "@/shared/mapper";

import type { DashboardPageView } from "@/features/dashboard/lib/types";

export const toDashboardPageView: Mapper<
    DashboardResponse,
    DashboardPageView
> = (r) => ({
    user: {
        ...r.user,
    },
    clockStatus: r.clockStatus,
    todayRecord: r.todayRecord,
    recentRecords: r.recentRecords,
    stats: r.stats,
});
