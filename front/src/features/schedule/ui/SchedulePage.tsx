import React from 'react';
import { Container } from '@/shared/components';
import { useSchedule } from '@/features/schedule/hooks/useSchedule';
import { SchedulePresenter } from '@/features/schedule/ui/SchedulePresenter';

const SchedulePage: React.FC = () => {
  const { currentMonth, schedule, nextMonth, prevMonth } = useSchedule();

  return (
    <Container size="full">
      <SchedulePresenter
        currentMonth={currentMonth}
        schedule={schedule}
        nextMonth={nextMonth}
        prevMonth={prevMonth}
      />
    </Container>
  );
};

export default SchedulePage;
