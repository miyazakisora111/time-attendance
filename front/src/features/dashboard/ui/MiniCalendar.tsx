import React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, Typography, Button } from "@/shared/components";
import { AsyncDataState } from "@/shared/components/states/AsyncDataState";
import { DAYS, DAY_TYPE_CLASS } from "@/shared/presentation/day";
import { cn } from "@/shared/utils/style";

import { useMiniCalendarViewModel } from "@/features/dashboard/viewModels/MiniCalendarViewModel";

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

/**
 * ミニカレンダー。
 *
 * ViewModel から受け取った値のみを使い、ロジックを持たない View 層。
 */
export const MiniCalendar = React.memo(function MiniCalendar() {
  const { monthLabel, days, isLoading, isError, nextMonth, prevMonth } = useMiniCalendarViewModel();

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
              {monthLabel}
            </Typography>
            <Button variant="ghost" size="icon" unstableClassName="h-8 w-8 text-gray-600" aria-label="翌月" onClick={nextMonth}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AsyncDataState isLoading={isLoading} isError={isError} isEmpty={days.length === 0}>
          <div className="grid grid-cols-7 gap-1">
            {Object.values(DAYS).map((day) => (
              <div
                key={day.key}
                className={cn(
                  'py-2 text-center text-xs font-semibold',
                  DAY_TYPE_CLASS[day.type]
                )}
              >
                {day.label}
              </div>
            ))}
            {days.map((day) => (
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