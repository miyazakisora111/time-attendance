import { motion } from "framer-motion";

import { Container, Typography } from "@/shared/components";
import { PageTransition } from "@/shared/components/transitions/PageTransition";
import { fadeUp } from "@/shared/animations/presets";
import { stagger } from "@/shared/animations/stagger";
import { transitionNormal } from "@/shared/animations/transitions";

import { useDashboardPage } from "@/features/dashboard/hooks/useDashboardPage";
import { useMiniCalendar } from "@/features/dashboard/hooks/useMiniCalendar";
import { useMonthlyStats } from "@/features/dashboard/hooks/useMonthlyStats";
import { useRecentRecordsCard } from "@/features/dashboard/hooks/useRecentRecordsCard";
import { ClockInCard } from "@/features/attendance/ui/components/ClockInCard/ClockInCard";
import { MiniCalendar } from "@/features/dashboard/ui/components/MiniCalendar/MiniCalendar";
import { MonthlyStatsCard } from "@/features/dashboard/ui/components/MonthlyStatsCard/MonthlyStatsCard";
import { QuickActionsCard } from "@/features/dashboard/ui/components/QuickActionsCard/QuickActionsCard";
import { RecentRecordsCard } from "@/features/dashboard/ui/components/RecentRecordsCard/RecentRecordsCard";
import type { DashboardPageProps } from "@/features/dashboard/ui/page/DashBoardPage.types";

/**
 * ダッシュボード画面（Presentational）
 * propsのみで描画し、hooks/stateを持たない。
 */
function DashBoardPageView({
    userName,
    clockInCard,
    handleAction,
    miniCalendar,
    monthlyStats,
    recentRecords,
}: DashboardPageProps) {
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
                            {userName ? `${userName}さん、` : ""}本日も1日頑張りましょう！
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
                            <MonthlyStatsCard {...monthlyStats} />
                        </motion.div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

                            {/* Clock */}
                            <motion.div className="xl:col-span-4" variants={fadeUp} transition={transitionNormal}>
                                <ClockInCard
                                    view={clockInCard}
                                    onAction={handleAction}
                                />
                            </motion.div>

                            {/* Right Side */}
                            <div className="grid gap-6 xl:col-span-8">

                                {/* Utilities */}
                                <motion.div className="grid grid-cols-1 gap-6 md:grid-cols-2" variants={fadeUp} transition={transitionNormal}>
                                    <MiniCalendar {...miniCalendar} />
                                    <QuickActionsCard />
                                </motion.div>

                                {/* Activity */}
                                <motion.div variants={fadeUp} transition={transitionNormal}>
                                    <RecentRecordsCard {...recentRecords} />
                                </motion.div>

                            </div>
                        </div>
                    </motion.section>

                </Container>
            </div>
        </PageTransition>
    );
}

/**
 * ダッシュボード画面（Container）
 * 各featureのhooksを組み合わせ、Presentationalコンポーネントにpropsを渡す。
 */
export function DashBoardPage() {
    const page = useDashboardPage();
    const miniCalendar = useMiniCalendar();
    const monthlyStats = useMonthlyStats();
    const recentRecords = useRecentRecordsCard();

    return (
        <DashBoardPageView
            {...page}
            miniCalendar={miniCalendar}
            monthlyStats={monthlyStats}
            recentRecords={recentRecords}
        />
    );
}
