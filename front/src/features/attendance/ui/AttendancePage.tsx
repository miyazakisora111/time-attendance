import { motion } from 'framer-motion';

import { Card, Container } from '@/shared/components';
import { PageTransition } from '@/shared/components/transitions/PageTransition';
import { fadeUp } from '@/shared/animations/presets';
import { stagger } from '@/shared/animations/stagger';
import { transitionNormal } from '@/shared/animations/transitions';

import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import { ClockCard } from '@/features/attendance/ui/components/ClockCard/ClockCard';
import { StatusCard } from '@/features/attendance/ui/components/StatusCard/StatusCard';
import { createStatusCardView } from '@/features/attendance/ui/components/StatusCard/createStatusCardView';
import { WorkTimeCard } from '@/features/attendance/ui/components/WorkTimeCard/WorkTimeCard';
import { createWorkTimeCardView } from '@/features/attendance/ui/components/WorkTimeCard/createWorkTimeCardView';
import { ActionCard } from '@/features/attendance/ui/components/ActionCard/ActionCard';
import { RecentActivityCard } from '@/features/attendance/ui/components/RecentActivityCard/RecentActivityCard';

/**
 * 勤怠画面
 */
export function AttendancePage() {
  const {
    clockStatus,
    attendanceStatus,
    lastActionView,
    isLoading,
    isError,
    isPending,
    totalWorkedMinutes,
    breakMinutes,
    overtimeMinutes,
    handleAction,
  } = useAttendance();

  const statusCardView = createStatusCardView(attendanceStatus);
  const workTimeCardView = createWorkTimeCardView(totalWorkedMinutes, breakMinutes, overtimeMinutes);

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
                <ClockCard />
              </motion.div>
              <motion.div variants={fadeUp} transition={transitionNormal}>
                <StatusCard view={statusCardView} />
              </motion.div>
              <motion.div variants={fadeUp} transition={transitionNormal}>
                <WorkTimeCard view={workTimeCardView} />
              </motion.div>
              <motion.div variants={fadeUp} transition={transitionNormal}>
                <ActionCard
                  clockStatus={clockStatus}
                  isPending={isLoading || isPending}
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
              lastAction={lastActionView}
              isLoading={isLoading}
              isError={isError}
            />
          </motion.div>
        </div>
      </Container>
    </PageTransition>
  );
}
