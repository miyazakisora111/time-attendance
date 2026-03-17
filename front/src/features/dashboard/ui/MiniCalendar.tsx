import React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/buttons/Button";
import { Card, CardContent, CardHeader, CardTitle, Typography } from "@/shared/components";
import {
  DASHBOARD_MINI_CALENDAR_MONTH,
  DASHBOARD_MINI_CALENDAR_TITLE,
  dashboardMiniCalendarDays,
  dashboardMiniCalendarDaysOfWeek,
  dashboardMiniCalendarLegends,
} from "@/shared/presentation/dashboard";

export const MiniCalendar = React.memo(function MiniCalendar() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="text-blue-600" />
            {DASHBOARD_MINI_CALENDAR_TITLE}
          </CardTitle>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600" aria-label="前月">
              <ChevronLeft size={16} />
            </Button>
            <Typography variant="label" intent="muted">
              {DASHBOARD_MINI_CALENDAR_MONTH}
            </Typography>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600" aria-label="翌月">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
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

          {dashboardMiniCalendarDays.map((day) => (
            <div
              key={`${day.date}-${day.day || "blank"}`}
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
      </CardContent>
    </Card>
  );
});