import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import { Card, Container } from '@/shared/components';
import { createStatusCardView } from './components/StatusCard/createStatusCardView';
import { createWorkTimeCardView } from './components/WorkTimeCard/createWorkTimeCardView';
import { ClockCard } from './components/ClockCard/ClockCard';
import { StatusCard } from './components/StatusCard/StatusCard';
import { WorkTimeCard } from './components/WorkTimeCard/WorkTimeCard';
import { ActionCard } from './components/ActionCard/ActionCard';
import { RecentActivityCard } from './components/RecentActivityCard/RecentActivityCard';

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
    <Container size="full">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card
          variant="elevated"
          padding="lg"
          unstableClassName="relative overflow-hidden border-gray-100"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ClockCard />
            <StatusCard view={statusCardView} />
            <WorkTimeCard view={workTimeCardView} />
            <ActionCard
              clockStatus={clockStatus}
              isPending={isLoading || isPending}
              onAction={handleAction}
            />
          </div>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RecentActivityCard
            lastAction={lastActionView}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
    </Container>
  );
}
