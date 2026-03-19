
import { Container, Typography } from "@/shared/components";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardQueries";
import {
  ClockInOutCard,
  DashboardLayoutGrid,
  MiniCalendar,
  MonthlyStatsCard,
  QuickActionsCard,
  RecentRecordsCard,
} from "@/features/dashboard/ui";
import { DASHBOARD_TITLE, formatDashboardGreeting } from "@/shared/presentation/dashboard";

export default function DashBoardPage() {
  const { data } = useDashboardData();

  return (
    <div className="min-h-screen from-gray-50 to-blue-50/30">
      <Container size="lg" unstableClassName="grid gap-8 py-8">
        <header>
          <Typography asChild variant="h1">
            <h1>{DASHBOARD_TITLE}</h1>
          </Typography>
          <Typography variant="body" intent="muted">
            {formatDashboardGreeting(data?.user?.name)}
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
