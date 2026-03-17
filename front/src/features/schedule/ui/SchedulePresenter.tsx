import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Download, Filter, Clock, MapPin, Info, 
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, Button, Typography, Badge } from '@/shared/components';
import { cn } from '@/shared/utils/style';
import type { DaySchedule } from '@/domain/enums/schedule';
import { formatJapaneseYearMonth } from '@/shared/presentation/format';
import {
  getScheduleShiftLabel,
  getScheduleStatusView,
  getScheduleTimeRangeText,
} from '@/shared/presentation/schedule';

interface SchedulePresenterProps {
  currentMonth: Date;
  schedule: DaySchedule[];
  nextMonth: () => void;
  prevMonth: () => void;
}

export const SchedulePresenter: React.FC<SchedulePresenterProps> = ({
  currentMonth,
  schedule,
  nextMonth,
  prevMonth,
}) => {
  const monthName = formatJapaneseYearMonth(currentMonth);

  return (
    <div className="space-y-8">
      {/* Calendar Header */}
      <Card variant="elevated" padding="none" className="overflow-hidden border-none shadow-md">
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <CalendarIcon size={24} />
            </div>
            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900">{monthName}</Typography>
              <Typography variant="small" intent="muted" className="italic">Your Work Schedule</Typography>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-2xl">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm">
              <ChevronLeft size={20} className="text-gray-500" />
            </Button>
            <Typography variant="label" className="px-4 text-gray-700">{monthName}</Typography>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm">
              <ChevronRight size={20} className="text-gray-500" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" intent="secondary" className="rounded-xl gap-2">
              <Filter size={18} />
              <Typography variant="label">表示切替</Typography>
            </Button>
            <Button variant="solid" intent="primary" className="rounded-xl gap-2 shadow-lg shadow-blue-100">
              <Download size={18} />
              <Typography variant="label">エクスポート</Typography>
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated" intent="primary" padding="lg" className="border-none text-white">
          <Typography variant="small" intent="white" className="mb-1 font-medium italic">今月の総労働時間</Typography>
          <Typography variant="h2" intent="white" className="text-4xl font-black mb-6">154.5h</Typography>
          <div className="flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full text-white">
            <Info size={14} />
            <Typography variant="small" intent="white">所定: 160h に対し 96%</Typography>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" className="border-none">
          <Typography variant="small" intent="muted" className="mb-1 font-medium">今月の残業時間</Typography>
          <Typography variant="h2" className="text-4xl font-black text-gray-900 mb-6">12.0h</Typography>
          <div className="flex items-center gap-4">
            <Typography variant="small" className="flex items-center gap-1 text-orange-500 font-bold"><Clock size={14} /> 定内: 8h</Typography>
            <Typography variant="small" className="flex items-center gap-1 text-orange-500 font-bold"><AlertCircle size={14} /> 定外: 4h</Typography>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" className="border-none">
          <Typography variant="small" intent="muted" className="mb-1 font-medium">有給取得日数</Typography>
          <Typography variant="h2" className="text-4xl font-black text-blue-600 mb-6">2.0日</Typography>
          <Typography variant="small" intent="primary" className="font-bold">
            残り: 12.5日
          </Typography>
        </Card>
      </div>

      {/* Schedule Grid/List */}
      <div className="space-y-3">
        {schedule.map((day, index) => {
          const styles = getScheduleStatusView(day.status);
          return (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              key={day.date}
            >
              <Card className={`border-none shadow-sm hover:shadow-md transition-all ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                <CardContent className={`p-0 ${styles.bg}`}>
                  <div className={`flex flex-col md:flex-row md:items-center gap-6 p-5 ${styles.border}`}>
                    {/* Date & Day */}
                    <div className="w-20 text-center md:text-left">
                      <Typography variant="label" className="text-lg font-black text-gray-900 tracking-tight block leading-tight">{day.date}</Typography>
                      <Typography variant="small" className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">{day.isToday ? 'Today' : 'Weekday'}</Typography>
                    </div>

                    {/* Shift Info */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-6">
                      <div>
                        <Typography variant="label" className={cn("block text-sm", styles.text)}>{getScheduleShiftLabel(day)}</Typography>
                        <div className="flex items-center gap-3 mt-1">
                          <Typography variant="small" intent="muted" className="flex items-center gap-1 font-medium">
                            <Clock size={12} />
                            {getScheduleTimeRangeText(day.timeRange)}
                          </Typography>
                          <Typography variant="small" intent="muted" className="flex items-center gap-1 font-medium">
                            <MapPin size={12} />
                            Office-A
                          </Typography>
                        </div>
                      </div>

                      <div className="flex-1 hidden md:block">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          {day.status === 'working' && <div className="h-full w-full bg-blue-500/30" />}
                        </div>
                      </div>
                    </div>

                    {/* Status & Action */}
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none border-gray-100 pt-4 md:pt-0">
                      <Badge intent={styles.intent}>{styles.badgeLabel}</Badge>
                      <Button variant="ghost" size="sm" className="rounded-lg">
                        <Typography variant="small" intent="primary" className="font-bold">詳細</Typography>
                      </Button>
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
};
