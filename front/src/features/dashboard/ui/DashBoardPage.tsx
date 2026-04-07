import { Container, Typography } from "@/shared/components";
import { stack } from "@/shared/design-system/layout";
import { useDashboard } from "@/features/dashboard/hooks/useDashboardQueries";
import {
  ClockInOutCard,
  MiniCalendar,
  MonthlyStatsCard,
  QuickActionsCard,
  RecentRecordsCard,
} from "@/features/dashboard/ui";

export default function DashBoardPage() {
  const { data: dashboardData } = useDashboard();
  const name = dashboardData?.user?.name;

  return (
    <div className="min-h-screen">
      <Container size="lg" unstableClassName="grid gap-8 py-8">

        {/* Header */}
        <header className={stack.sm}>
          <Typography asChild variant="h1">
            <h1>ダッシュボード</h1>
          </Typography>
          <Typography variant="body" intent="muted">
            {name ? `${name}さん、` : ""}本日も1日頑張りましょう！
          </Typography>
        </header>

        {/* Layout Grid */}
        <section className="grid gap-6">

          {/* Summary */}
          <div>
            <MonthlyStatsCard />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

            {/* Clock */}
            <div className="xl:col-span-4">
              <ClockInOutCard />
            </div>

            {/* Right Side */}
            <div className="grid gap-6 xl:col-span-8">

              {/* Utilities */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <MiniCalendar />
                <QuickActionsCard />
              </div>

              {/* Activity */}
              <div>
                <RecentRecordsCard />
              </div>

            </div>
          </div>
        </section>

      </Container>
    </div>
  );
}
