
import { Container, Typography } from "@/shared/components";
import {
  ClockInOutCard,
  DashboardLayoutGrid,
  MiniCalendar,
  MonthlyStatsCard,
  QuickActionsCard,
  RecentRecordsCard,
} from "@/features/dashboard/ui";
import { useDashboardData } from "@/features/dashboard/model/useDashboard";

export default function DashBoardPage() {
  const { data } = useDashboardData();

  return (
    <div className="min-h-screen from-gray-50 to-blue-50/30">
      <Container size="lg" className="grid gap-8 py-8">
        <header>
          <Typography asChild variant="h1">
            <h1>ダッシュボード</h1>
          </Typography>
          <Typography variant="body" intent="muted">
            {data?.user?.name ? `${data.user.name}さん、本日も1日頑張りましょう！` : "本日も1日頑張りましょう！"}
          </Typography>
        </header>
        <DashboardLayoutGrid
          summary={<MonthlyStatsCard />}
          clock={<ClockInOutCard />}
          utilities={
            <>
              <MiniCalendar />
              <QuickActionsCard />
            </>
          }
          activity={<RecentRecordsCard />}
        />
      </Container>
    </div>
  );
}
