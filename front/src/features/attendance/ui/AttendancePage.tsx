import { motion } from 'framer-motion';

import { Card, Container } from '@/shared/components';
import { PageTransition } from '@/shared/components/transitions/PageTransition';
import { fadeUp } from '@/shared/animations/presets';
import { stagger } from '@/shared/animations/stagger';
import { transitionNormal } from '@/shared/animations/transitions';

import { useAttendancePageViewModel } from '@/features/attendance/viewModels/AttendancePageViewModel';
import { ClockInCard } from '@/features/attendance/ui/components/ClockInCard';
import { WorkTimeCard } from '@/features/attendance/ui/components/WorkTimeCard';
import { ActionCard } from '@/features/attendance/ui/components/ActionCard';
import { RecentActivityCard } from '@/features/attendance/ui/components/RecentActivityCard';

/**
 * 勤怠画面
 */
export function AttendancePage() {
  const {
    clockInCard,
    workTimeCard,
    actionCard,
    recentActivity,
    isLoading,
    isError,
    handleAction,
  } = useAttendancePageViewModel();

  return (
    <PageTransition>
      <Container size="full">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card
            variant="elevated"
            padding="lg"
            unstableClassName="relative overflow-hidden border-gray-100"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
            <motion.div
              className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeUp} transition={transitionNormal}>
                <ClockInCard
                  view={clockInCard}
                  onAction={handleAction}
                />
              </motion.div>
              <motion.div variants={fadeUp} transition={transitionNormal}>
                <WorkTimeCard view={workTimeCard} />
              </motion.div>
              <motion.div variants={fadeUp} transition={transitionNormal}>
                <ActionCard
                  clockStatus={actionCard.clockStatus}
                  isPending={actionCard.isPending}
                  onAction={handleAction}
                />
              </motion.div>
            </motion.div>
          </Card>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={transitionNormal}
          >
            <RecentActivityCard
              view={recentActivity}
              isLoading={isLoading}
              isError={isError}
            />
          </motion.div>
        </div>
      </Container>
    </PageTransition>
  );
}
