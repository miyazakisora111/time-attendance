import React from 'react';
import { Container } from '@/shared/components';
import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import { AttendancePresenter } from '@/features/attendance/ui/AttendancePresenter';

const AttendancePage: React.FC = () => {
  const {
    status,
    currentTime,
    lastAction,
    isLoading,
    isError,
    isPending,
    todayWorkedTime,
    breakTime,
    handleAction,
  } = useAttendance();

  return (
    <Container size="full">
      <AttendancePresenter
        status={status}
        currentTime={currentTime}
        lastAction={lastAction}
        isLoading={isLoading}
        isError={isError}
        isPending={isPending}
        todayWorkedTime={todayWorkedTime}
        breakTime={breakTime}
        onAction={handleAction}
      />
    </Container>
  );
};

export default AttendancePage;
