import React from 'react';
import { Container } from '@/shared/components';
import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import { AttendancePresenter } from '@/features/attendance/ui/AttendancePresenter';

/**
 * 勤怠画面
 */
const AttendancePage: React.FC = () => {
  const {
    status,
    currentTime,
    lastAction,
    isLoading,
    isError,
    isPending,
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
        onAction={handleAction}
      />
    </Container>
  );
};

export default AttendancePage;
