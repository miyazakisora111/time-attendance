import React from 'react';
import { Container } from '@/shared/components';
import { AsyncDataState } from '@/shared/components/AsyncDataState';
import { useSchedule } from '@/features/schedule/hooks/useSchedule';
import { SchedulePresenter } from '@/features/schedule/ui/SchedulePresenter';

const SchedulePage: React.FC = () => {
  const { isLoading, isError, currentMonth, schedule, nextMonth, prevMonth } = useSchedule();

  return (
    <Container size="full">
      <AsyncDataState isLoading={isLoading} isError={isError} isEmpty={schedule.length === 0}>
        <SchedulePresenter
          currentMonth={currentMonth}
          schedule={schedule}
          nextMonth={nextMonth}
          prevMonth={prevMonth}
        />
      </AsyncDataState>
    </Container>
  );
};

export default SchedulePage;
