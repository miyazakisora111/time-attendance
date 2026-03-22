import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Clock,
  MapPin,
  Info,
  CalendarDays,
} from 'lucide-react';
import { Badge, Button, Card, CardContent, Typography } from '@/shared/components';
import { cn } from '@/shared/utils/style';
import { stack } from '@/shared/design-system/layout';
import type { DaySchedule, ScheduleSummary } from '@/domain/schedule/types';
import {
  formatJapaneseDays,
  formatJapaneseHours,
  formatJapaneseYearMonth,
} from '@/shared/utils/format';
import { EMPTY_TIME_RANGE_TEXT } from '@/shared/utils/format';
import { getScheduleStatusView } from '@/shared/presentation/schedule';

const getScheduleShiftLabel = (day: DaySchedule): string => {
  return day.shift || getScheduleStatusView(day.status).shiftFallback;
};

const getScheduleTimeRangeText = (timeRange?: string): string => {
  return timeRange || EMPTY_TIME_RANGE_TEXT;
};

interface SchedulePresenterProps {
  currentMonth: Date;
  schedule: DaySchedule[];
  visibleSchedule: DaySchedule[];
  summary: ScheduleSummary;
  showOnlyWorkingDays: boolean;
  toggleWorkingDaysFilter: () => void;
  nextMonth: () => void;
  prevMonth: () => void;
}

export const SchedulePresenter = React.memo<SchedulePresenterProps>(function SchedulePresenter({
  currentMonth,
  schedule,
  visibleSchedule,
  summary,
  showOnlyWorkingDays,
  toggleWorkingDaysFilter,
  nextMonth,
  prevMonth,
}) {
  const monthName = formatJapaneseYearMonth(currentMonth);

  const workProgress = summary.targetHours > 0
    ? Math.min(Math.round((summary.totalWorkHours / summary.targetHours) * 100), 100)
    : 0;

  const handleExport = () => {
    const csv = [
      ['日付', '曜日', '勤務区分', '時間帯', '勤務場所', '備考'].join(','),
      ...schedule.map((day) => [
        day.date,
        day.dayOfWeek,
        getScheduleShiftLabel(day),
        getScheduleTimeRangeText(day.timeRange),
        day.location ?? '-',
        day.note ?? '-',
      ].map((value) => `"${value.replaceAll('"', '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `schedule-${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={stack.xl}>
      <Card variant="elevated" padding="none" unstableClassName="overflow-hidden border-none shadow-md">
        <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
              <CalendarIcon size={24} />
            </div>
            <div>
              <Typography variant="h2">
                {monthName}
              </Typography>
              <Typography variant="small" intent="muted">
                API から取得した月次スケジュールを表示しています
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-gray-100 p-1.5">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft size={20} className="text-gray-500" />
            </Button>
            <Typography variant="label" unstableClassName="px-4">
              {monthName}
            </Typography>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight size={20} className="text-gray-500" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={showOnlyWorkingDays ? 'solid' : 'outline'}
              intent={showOnlyWorkingDays ? 'primary' : 'secondary'}
              unstableClassName="gap-2"
              onClick={toggleWorkingDaysFilter}
            >
              <Filter size={18} />
              <Typography variant="label">{showOnlyWorkingDays ? '全件表示' : '勤務日のみ'}</Typography>
            </Button>
            <Button variant="solid" intent="primary" unstableClassName="gap-2" onClick={handleExport}>
              <Download size={18} />
              <Typography variant="label">CSV エクスポート</Typography>
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card variant="elevated" intent="primary" padding="lg" unstableClassName="border-none text-white">
          <Typography variant="small" intent="white" unstableClassName="mb-1 font-medium">
            今月の総労働時間
          </Typography>
          <Typography variant="h2" intent="white" unstableClassName="mb-6">
            {formatJapaneseHours(summary.totalWorkHours)}
          </Typography>
          <div className="flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
            <Info size={14} />
            <Typography variant="small" intent="white">
              所定: {formatJapaneseHours(summary.targetHours)} に対し {workProgress}%
            </Typography>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" unstableClassName="border-none">
          <Typography variant="small" intent="muted" unstableClassName="mb-1 font-medium">
            今月の残業時間
          </Typography>
          <Typography variant="h2" unstableClassName="mb-6">
            {formatJapaneseHours(summary.overtimeHours)}
          </Typography>
          <div className="flex items-center gap-4">
            <Typography variant="small" unstableClassName="flex items-center gap-1 text-orange-500 font-bold">
              <Clock size={14} />
              勤務日数: {formatJapaneseDays(summary.scheduledWorkDays)}
            </Typography>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" unstableClassName="border-none">
          <Typography variant="small" intent="muted" unstableClassName="mb-1 font-medium">
            有給取得日数
          </Typography>
          <Typography variant="h2" intent="primary" unstableClassName="mb-6">
            {formatJapaneseDays(summary.paidLeaveDays)}
          </Typography>
          <Typography variant="small" intent="primary" unstableClassName="font-bold">
            残り: {formatJapaneseDays(summary.remainingPaidLeaveDays)}
          </Typography>
        </Card>
      </div>

      <div className={stack.sm}>
        {visibleSchedule.map((day, index) => {
          const styles = getScheduleStatusView(day.status);

          return (
            <motion.div
              key={day.isoDate}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Card unstableClassName={`border-none shadow-sm hover:shadow-md transition-all ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                <CardContent unstableClassName={`p-0 ${styles.bg}`}>
                  <div className={`flex flex-col gap-6 p-5 md:flex-row md:items-center ${styles.border}`}>
                    <div className="w-20 text-center md:text-left">
                      <Typography variant="label" unstableClassName="block text-lg font-black leading-tight tracking-tight">
                        {day.date}
                      </Typography>
                      <Typography variant="small" intent="muted" unstableClassName="font-bold uppercase tracking-widest text-[10px]">
                        {day.isToday ? `今日 / ${day.dayOfWeek}` : day.dayOfWeek}
                      </Typography>
                    </div>

                    <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-center">
                      <div>
                        <Typography variant="label" unstableClassName={cn('block text-sm', styles.text)}>
                          {getScheduleShiftLabel(day)}
                        </Typography>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                          <Typography variant="small" intent="muted" unstableClassName="flex items-center gap-1 font-medium">
                            <Clock size={12} />
                            {getScheduleTimeRangeText(day.timeRange)}
                          </Typography>
                          <Typography variant="small" intent="muted" unstableClassName="flex items-center gap-1 font-medium">
                            <MapPin size={12} />
                            {day.location ?? '未設定'}
                          </Typography>
                          {day.note ? (
                            <Typography variant="small" intent="muted" unstableClassName="flex items-center gap-1 font-medium">
                              <CalendarDays size={12} />
                              {day.note}
                            </Typography>
                          ) : null}
                        </div>
                      </div>

                      <div className="hidden flex-1 md:block">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          {day.status === 'working' ? <div className="h-full w-full bg-blue-500/30" /> : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 border-t border-gray-100 pt-4 md:justify-end md:border-none md:pt-0">
                      <Badge intent={styles.intent}>{styles.badgeLabel}</Badge>
                      <Typography variant="small" intent="muted">
                        {day.isHoliday ? '予定外の勤務はありません' : '勤務予定を表示'}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
