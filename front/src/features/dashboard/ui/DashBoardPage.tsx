import { motion } from "framer-motion";

import { Container, Typography } from "@/shared/components";
import { PageTransition } from "@/shared/components/transitions/PageTransition";
import { fadeUp } from "@/shared/animations/presets";
import { stagger } from "@/shared/animations/stagger";
import { transitionNormal } from "@/shared/animations/transitions";

import { useDashboard } from "@/features/dashboard/hooks/useDashboardQueries";
import { ClockInOutCard } from "@/features/dashboard/ui/ClockInOutCard";
import { MiniCalendar } from "@/features/dashboard/ui/MiniCalendar";
import { MonthlyStatsCard } from "@/features/dashboard/ui/MonthlyStatsCard";
import { QuickActionsCard } from "@/features/dashboard/ui/QuickActionsCard";
import { RecentRecordsCard } from "@/features/dashboard/ui/RecentRecordsCard";

export function DashBoardPage() {
  const { data: dashboardData } = useDashboard();
  const name = dashboardData?.user?.name;

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Container size="lg" unstableClassName="grid gap-8 py-8">

          {/* Header */}
          <header>
            <Typography asChild variant="h1">
              <h1>ダッシュボード</h1>
            </Typography>
            <Typography variant="body" intent="muted">
              {name ? `${name}さん、` : ""}本日も1日頑張りましょう！
            </Typography>
          </header>

          {/* Layout Grid */}
          <motion.section
            className="grid gap-6"
            variants={stagger}
            initial="initial"
            animate="animate"
          >

            {/* Summary */}
            <motion.div variants={fadeUp} transition={transitionNormal}>
              <MonthlyStatsCard />
            </motion.div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

              {/* Clock */}
              <motion.div className="xl:col-span-4" variants={fadeUp} transition={transitionNormal}>
                <ClockInOutCard />
              </motion.div>

              {/* Right Side */}
              <div className="grid gap-6 xl:col-span-8">

                {/* Utilities */}
                <motion.div className="grid grid-cols-1 gap-6 md:grid-cols-2" variants={fadeUp} transition={transitionNormal}>
                  <MiniCalendar />
                  <QuickActionsCard />
                </motion.div>

                {/* Activity */}
                <motion.div variants={fadeUp} transition={transitionNormal}>
                  <RecentRecordsCard />
                </motion.div>

              </div>
            </div>
          </motion.section>

        </Container>
      </div>
    </PageTransition>
  );
}
