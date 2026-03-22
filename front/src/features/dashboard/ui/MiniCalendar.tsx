import React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Typography, Button } from "@/shared/components";
import { AsyncDataState } from "@/shared/components/states/AsyncDataState";
import { useDashboardCalendar } from "@/features/dashboard/hooks/useDashboardCalendar";
import { formatJapaneseYearMonth } from "@/shared/utils/format";
import { DAYS_OF_WEEK } from "@/shared/constants/date";

const dashboardMiniCalendarLegends = [
  {
    key: 'workday',
    label: '出勤',
    swatchClassName: 'h-3 w-3 rounded-sm border border-green-200 bg-green-100',
  },
  {
    key: 'holiday',
    label: '休日',
    swatchClassName: 'h-3 w-3 rounded-sm border border-red-200 bg-red-100',
  },
  {
    key: 'today',
    label: '今日',
    swatchClassName: 'h-3 w-3 rounded-sm bg-blue-600',
  },
] as const;

interface DashboardMiniCalendarSource {
  date: string;
  status: 'working' | 'off' | 'holiday' | 'pending';
  isToday: boolean;
  isHoliday: boolean;
}

interface DashboardMiniCalendarDay {
  key: string;
  day: string;
  isWorkday?: boolean;
  isHoliday?: boolean;
  isToday?: boolean;
}

const dashboardMiniCalendarDaysOfWeek = DAYS_OF_WEEK;

const buildDashboardMiniCalendarDays = (
  days: ReadonlyArray<DashboardMiniCalendarSource>,
): DashboardMiniCalendarDay[] => {
  if (days.length === 0) {
    return [];
  }

  const firstDate = new Date(`${days[0].date}T00:00:00`);
  const leadingBlankDays = Array.from({ length: firstDate.getDay() }, (_, index) => ({
    key: `blank-${index}`,
    day: '',
  }));

  const mappedDays = days.map((day) => ({
    key: day.date,
    day: String(new Date(`${day.date}T00:00:00`).getDate()),
    isWorkday: day.status === 'working',
    isHoliday: day.isHoliday,
    isToday: day.isToday,
  }));

  return [...leadingBlankDays, ...mappedDays];
};

export const MiniCalendar = React.memo(function MiniCalendar() {
  const { currentMonth, calendar, isLoading, isError, nextMonth, prevMonth } = useDashboardCalendar();
  const calendarDays = buildDashboardMiniCalendarDays(calendar?.days ?? []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle unstableClassName="flex items-center gap-2">
            <CalendarIcon className="text-blue-600" />
            カレンダー
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" unstableClassName="h-8 w-8 text-gray-600" aria-label="前月" onClick={prevMonth}>
              <ChevronLeft size={16} />
            </Button>
            <Typography variant="label" intent="muted">
              {formatJapaneseYearMonth(currentMonth)}
            </Typography>
            <Button variant="ghost" size="icon" unstableClassName="h-8 w-8 text-gray-600" aria-label="翌月" onClick={nextMonth}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AsyncDataState isLoading={isLoading} isError={isError} isEmpty={calendarDays.length === 0}>
          <div className="grid grid-cols-7 gap-1">
            {dashboardMiniCalendarDaysOfWeek.map((day, index) => (
              <div
                key={day}
                className={[
                  "py-2 text-center text-xs font-semibold",
                  index === 0
                    ? "text-red-600"
                    : index === 6
                      ? "text-blue-600"
                      : "text-gray-500",
                ].join(" ")}
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day) => (
              <div
                key={day.key}
                className={[
                  "aspect-square rounded-lg text-sm font-medium",
                  "flex items-center justify-center transition-colors",
                  day.day === ""
                    ? ""
                    : day.isToday
                      ? "bg-blue-600 text-white shadow-md"
                      : day.isWorkday
                        ? "cursor-pointer bg-green-50 text-green-700 hover:bg-green-100"
                        : day.isHoliday
                          ? "cursor-pointer bg-red-50 text-red-600 hover:bg-red-100"
                          : "cursor-pointer text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                {day.day}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 border-t border-gray-100 pt-4">
            {dashboardMiniCalendarLegends.map((legend) => (
              <div key={legend.key} className="flex items-center gap-1.5">
                <span className={legend.swatchClassName} />
                <Typography variant="small" intent="muted">
                  {legend.label}
                </Typography>
              </div>
            ))}
          </div>
        </AsyncDataState>
      </CardContent>
    </Card>
  );
});