import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/atoms/CardComposite";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../shared/components/atoms/Button";

export function MiniCalendar() {
  const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
  
  // Generate calendar days for December 2025
  const calendarDays = [
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
    { day: "17", date: 17 },
    { day: "18", date: 18 },
    { day: "19", date: 19 },
    { day: "20", date: 20 },
    { day: "21", date: 21 },
    { day: "22", date: 22 },
    { day: "23", date: 23 },
    { day: "24", date: 24 },
    { day: "25", date: 25 },
    { day: "26", date: 26 },
    { day: "27", date: 27 },
    { day: "28", date: 28 },
    { day: "29", date: 29 },
    { day: "30", date: 30 },
    { day: "31", date: 31 },
  ];

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
              className={`text-center text-xs py-2 ${
                index === 0 ? "text-red-600" : index === 6 ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-sm rounded-md ${
                day.day === "" 
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
