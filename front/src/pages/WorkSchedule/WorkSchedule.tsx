import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Filter, Info, Plus } from "lucide-react";
import { Button } from "../../shared/components/ui/button";
import { Card, CardContent } from "../../shared/components/ui/card";
import { Badge } from "../../shared/components/ui/badge";

// 曜日の定義
const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];

// カレンダーデータの生成ロジック（モック）
const generateCalendarData = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  // 前月のパディング
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, status: null });
  }

  // 当月のデータ生成
  for (let i = 1; i <= daysInMonth; i++) {
    const isWeekend = (firstDay + i - 1) % 7 === 0 || (firstDay + i - 1) % 7 === 6;
    let status = "normal";
    let clockIn = "09:00";
    let clockOut = "18:00";
    let total = "8.0h";

    if (isWeekend) {
      status = "holiday";
      clockIn = "-";
      clockOut = "-";
      total = "-";
    } else if (i === 5) {
      status = "late";
      clockIn = "09:45";
      total = "7.25h";
    } else if (i === 12) {
      status = "paid-leave";
      clockIn = "-";
      clockOut = "-";
      total = "-";
    } else if (i === 15) {
      status = "absent";
      clockIn = "-";
      clockOut = "-";
      total = "-";
    } else if (i > 15) {
      // 未来の日付
      status = "upcoming";
      clockIn = "-";
      clockOut = "-";
      total = "-";
    }

    days.push({ day: i, status, clockIn, clockOut, total });
  }

  return days;
};

export function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // 2026年2月
  const calendarDays = generateCalendarData(currentDate.getFullYear(), currentDate.getMonth());

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // ステータスに応じたバッジの取得
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">出勤</Badge>;
      case "late":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">遅刻</Badge>;
      case "paid-leave":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">有給</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">欠勤</Badge>;
      case "holiday":
        return <span className="text-gray-300 text-[10px] font-bold">公休</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* カレンダーヘッダー：年月切り替えとアクション */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
          </h2>
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 text-gray-600">
              <ChevronLeft size={18} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="text-xs text-gray-600">
              今月
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 text-gray-600">
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-gray-200 text-gray-600">
            <Filter size={14} />
            フィルター
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-gray-200 text-gray-600">
            <Download size={14} />
            CSV出力
          </Button>
          <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Plus size={14} />
            勤怠修正申請
          </Button>
        </div>
      </div>

      {/* 統計サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "所定労働日数", value: "20日", sub: "今月" },
          { label: "実労働日数", value: "12日", sub: "現在" },
          { label: "有給取得日数", value: "1.0日", sub: "今月" },
          { label: "残業合計時間", value: "12:45", sub: "今月" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <p className="text-xs text-gray-500 mb-1 font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
          {DAYS_OF_WEEK.map((day, i) => (
            <div 
              key={day} 
              className={`py-4 text-center text-xs font-bold uppercase tracking-widest ${
                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-400"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* 日付グリッド */}
        <div className="grid grid-cols-7">
          {calendarDays.map((dayData, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.005 }}
              className={`min-h-[120px] p-3 border-r border-b border-gray-50 last:border-r-0 group hover:bg-blue-50/30 transition-all ${
                !dayData.day ? "bg-gray-50/20" : ""
              }`}
            >
              {dayData.day && (
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-sm font-bold ${
                      (idx % 7 === 0) ? "text-red-500" : (idx % 7 === 6) ? "text-blue-500" : "text-gray-900"
                    }`}>
                      {dayData.day}
                    </span>
                    {getStatusBadge(dayData.status)}
                  </div>
                  
                  {dayData.clockIn !== "-" && (
                    <div className="space-y-1.5 mt-auto bg-gray-50/50 p-2 rounded-lg group-hover:bg-white transition-colors">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400 font-medium">出勤</span>
                        <span className="text-gray-700 font-bold">{dayData.clockIn}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400 font-medium">退勤</span>
                        <span className="text-gray-700 font-bold">{dayData.clockOut}</span>
                      </div>
                      <div className="pt-1 mt-1 border-t border-gray-200/50 flex items-center justify-between text-[10px]">
                        <span className="text-gray-400 font-medium">実働</span>
                        <span className="text-blue-600 font-bold">{dayData.total}</span>
                      </div>
                    </div>
                  )}

                  {dayData.status === "upcoming" && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-gray-200" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}