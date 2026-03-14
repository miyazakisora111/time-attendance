import React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/buttons/Button";
import { Card, CardContent, CardHeader, CardTitle, Typography } from "@/shared/components";

const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"] as const;

const CALENDAR_DAYS = [
  { day: "", date: 0 },
  { day: "1", date: 1, isWorkday: true },
  { day: "2", date: 2, isWorkday: true },
  { day: "3", date: 3, isWorkday: true },
  { day: "4", date: 4, isWorkday: true },
  { day: "5", date: 5, isWorkday: true },
  { day: "6", date: 6, isHoliday: true },
  { day: "7", date: 7, isHoliday: true },
  { day: "8", date: 8, isWorkday: true },
  { day: "9", date: 9, isWorkday: true },
  { day: "10", date: 10, isWorkday: true },
  { day: "11", date: 11, isWorkday: true },
  { day: "12", date: 12, isWorkday: true },
  { day: "13", date: 13, isHoliday: true },
  { day: "14", date: 14, isHoliday: true },
  { day: "15", date: 15, isWorkday: true },
  { day: "16", date: 16, isToday: true, isWorkday: true },
  { day: "17", date: 17, isWorkday: true },
  { day: "18", date: 18, isWorkday: true },
  { day: "19", date: 19, isWorkday: true },
  { day: "20", date: 20, isHoliday: true },
  { day: "21", date: 21, isHoliday: true },
  { day: "22", date: 22, isWorkday: true },
  { day: "23", date: 23, isWorkday: true },
  { day: "24", date: 24, isWorkday: true },
  { day: "25", date: 25, isWorkday: true },
  { day: "26", date: 26, isWorkday: true },
  { day: "27", date: 27, isHoliday: true },
  { day: "28", date: 28, isHoliday: true },
  { day: "29", date: 29, isWorkday: true },
  { day: "30", date: 30, isWorkday: true },
  { day: "31", date: 31, isWorkday: true },
];

export const MiniCalendar = React.memo(function MiniCalendar() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="text-blue-600" />
            カレンダー
          </CardTitle>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600" aria-label="前月">
              <ChevronLeft size={16} />
            </Button>
            <Typography variant="label" intent="muted">
              2025年12月
            </Typography>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600" aria-label="翌月">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map((day, index) => (
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

          {CALENDAR_DAYS.map((day) => (
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
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-green-200 bg-green-100" />
            <Typography variant="small" intent="muted">
              出勤
            </Typography>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-red-200 bg-red-100" />
            <Typography variant="small" intent="muted">
              休日
            </Typography>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-blue-600" />
            <Typography variant="small" intent="muted">
              今日
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});