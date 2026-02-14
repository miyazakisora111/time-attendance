import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export function MiniCalendar() {
  const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0〜11
  const lastDate = new Date(year, month + 1, 0).getDate(); // 今月の最終日
  const calendarDays = [];
  for (let d = 1; d <= lastDate; d++) {
    const dateObj = new Date(year, month, d);
    const dayOfWeek = dateObj.getDay(); // 0:日, 6:土
    const dayItem = {
      day: String(d),
      date: d,
      isWorkday: dayOfWeek >= 1 && dayOfWeek <= 5, // 月〜金は勤務日
      isHoliday: dayOfWeek === 0 || dayOfWeek === 6, // 土日
      isToday: d === today.getDate(),
    };
    calendarDays.push(dayItem);
  }
  calendarDays.unshift({ day: "", date: 0 });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="text-blue-600" />
            カレンダー
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm">2025年12月</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className={`text-center text-xs py-2 ${index === 0 ? "text-red-600" : index === 6 ? "text-blue-600" : "text-gray-600"
                }`}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-sm rounded-md ${day.day === ""
                  ? ""
                  : day.isToday
                    ? "bg-blue-600 text-white"
                    : day.isWorkday
                      ? "bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer"
                      : day.isHoliday
                        ? "bg-red-50 text-red-600"
                        : "hover:bg-gray-100 cursor-pointer"
                }`}
            >
              {day.day}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-gray-600">出勤</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-gray-600">休日</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-gray-600">今日</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
