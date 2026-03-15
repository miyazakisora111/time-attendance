import React from 'react';
import { Container } from '@/shared/components';
import { DataStateWrapper } from '@/shared/components/DataStateWrapper';
import { useSchedule } from '@/features/schedule/hooks/useSchedule';
import { SchedulePresenter } from '@/features/schedule/ui/SchedulePresenter';

const SchedulePage: React.FC = () => {
  const { isLoading, isError, currentMonth, schedule, nextMonth, prevMonth } = useSchedule();

  return (
    <Container size="full">
      <DataStateWrapper isLoading={isLoading} isEmpty={isError} emptyMessage="スケジュールの取得に失敗しました。">
        <SchedulePresenter
          currentMonth={currentMonth}
          schedule={schedule}
          nextMonth={nextMonth}
          prevMonth={prevMonth}
        />
      </DataStateWrapper>
    </Container>
  );
};

export default SchedulePage;
