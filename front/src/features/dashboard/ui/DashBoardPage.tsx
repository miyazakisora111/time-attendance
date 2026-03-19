import { Container, Typography } from "@/shared/components";
import { useDashboard } from "@/features/dashboard/hooks/useDashboardQueries";
import {
  ClockInOutCard,
  DashboardLayoutGrid,
  MiniCalendar,
  MonthlyStatsCard,
  QuickActionsCard,
  RecentRecordsCard,
} from "@/features/dashboard/ui";

export default function DashBoardPage() {
  const { data: dashboardData } = useDashboard();
  const name = dashboardData?.user?.name;

  return (
    <div className="min-h-screen from-gray-50 to-blue-50/30">
      <Container size="lg" unstableClassName="grid gap-8 py-8">
        <header>
          <Typography asChild variant="h1">
            <h1>ダッシュボード</h1>
          </Typography>
          <Typography variant="body" intent="muted">
            {name ? `${name}さん、本日も1日頑張りましょう！` : '本日も1日頑張りましょう！'}
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
