import React from 'react';
import { Container } from '@/shared/components';
import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import { AttendancePresenter } from '@/features/attendance/ui/AttendancePresenter';

/**
 * 勤怠画面コンテナ。
 *
 * 勤怠画面に必要な状態を取得し、表示コンポーネントへ渡す。
 */
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
