import type { DashboardResponse } from "@/__generated__/model";
import type { Mapper } from "@/shared/mapper";

import type { DashboardViewData } from "@/features/dashboard/types/DashboardViewData";

export const toDashboardView: Mapper<
  DashboardResponse,
  DashboardViewData
> = (r) => ({
  user: {
    ...r.user,
  },
  clockStatus: r.clockStatus,
  todayRecord: r.todayRecord,
  recentRecords: r.recentRecords,
  stats: r.stats,
});
