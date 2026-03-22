import React from 'react';
import { Container } from '@/shared/components';
import { AsyncDataState } from '@/shared/components/states/AsyncDataState';
import { useSchedule } from '@/features/schedule/hooks/useSchedule';
import { SchedulePresenter } from '@/features/schedule/ui/SchedulePresenter';

const SchedulePage: React.FC = () => {
  const {
    isLoading,
    isError,
    currentMonth,
    scheduleData,
    visibleSchedule,
    showOnlyWorkingDays,
    toggleWorkingDaysFilter,
    nextMonth,
    prevMonth,
  } = useSchedule();

  return (
    <Container size="full">
      <AsyncDataState isLoading={isLoading} isError={isError} isEmpty={scheduleData.days.length === 0}>
        <SchedulePresenter
          currentMonth={currentMonth}
          schedule={scheduleData.days}
          visibleSchedule={visibleSchedule}
          summary={scheduleData.summary}
          showOnlyWorkingDays={showOnlyWorkingDays}
          toggleWorkingDaysFilter={toggleWorkingDaysFilter}
          nextMonth={nextMonth}
          prevMonth={prevMonth}
        />
      </AsyncDataState>
    </Container>
  );
};

export default SchedulePage;
