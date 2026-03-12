import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, LogIn, LogOut, Coffee, MapPin, Shield, CheckCircle2, History, AlertCircle } from 'lucide-react';
import { Button, Card, CardContent, Typography } from '@/shared/components';
import type { AttendanceStatus, LastAction } from '@/domain/enums/attendance';

interface AttendancePresenterProps {
  status: AttendanceStatus;
  currentTime: Date;
  lastAction: LastAction | null;
  onAction: (type: AttendanceStatus, label: string) => void;
}

const getStatusDisplay = (status: AttendanceStatus) => {
  switch (status) {
    case 'working':
      return {
        text: <Typography variant="h3" intent="primary" className="mb-2">勤務中</Typography>,
        iconColor: 'text-blue-600',
        intent: 'primary' as const,
        description: <Typography variant="small" intent="primary" align="center" className="block">今日も順調に業務が進んでいます。適度に休憩を取りましょう。</Typography>,
        icon: <CheckCircle2 size={32} />,
      };
    case 'break':
      return {
        text: <Typography variant="h3" intent="warning" className="mb-2">休憩中</Typography>,
        iconColor: 'text-amber-600',
        intent: 'warning' as const,
        description: <Typography variant="small" intent="warning" align="center" className="block">リフレッシュして、次の業務に備えましょう。</Typography>,
        icon: <Coffee size={32} />,
      };
    default:
      return {
        text: <Typography variant="h3" intent="muted" className="mb-2">未出勤</Typography>,
        iconColor: 'text-gray-500',
        intent: 'muted' as const,
        description: <Typography variant="small" intent="muted" align="center" className="block">業務を開始する準備はできましたか？</Typography>,
        icon: <AlertCircle size={32} />,
      };
  }
};

export const AttendancePresenter: React.FC<AttendancePresenterProps> = ({
  status,
  currentTime,
  lastAction,
  onAction,
}) => {
  const currentStatus = getStatusDisplay(status);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Clock Section */}
      <Card variant="elevated" padding="lg" className="relative overflow-hidden border-gray-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Time Display */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-sm font-medium mb-6"
            >
              <Clock size={16} className="text-blue-500" />
              {currentTime.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </motion.div>
            
            <Typography variant="h1" className="text-5xl md:text-6xl tabular-nums font-black mb-4">
              {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Typography>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-300" />
                <Typography variant="small" intent="muted">東京都港区港南 / Office-A</Typography>
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-gray-300" />
                <Typography variant="small" intent="muted">IP: 192.168.1.xxx</Typography>
              </span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="w-full md:w-72">
            <Card variant="flat" intent={currentStatus.intent} padding="md" className="transition-colors duration-500">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm mb-4">
                  <div className={currentStatus.iconColor}>
                    {currentStatus.icon}
                  </div>
                </div>
                {currentStatus.text}
                <div className="leading-relaxed block">
                  {currentStatus.description}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          disabled={status !== 'out'}
          onClick={() => onAction('working', '出勤')}
          size="lg"
          variant={status === 'out' ? 'solid' : 'outline'}
          intent="primary"
          className="h-24"
        >
          <LogIn size={24} />
          <Typography variant="label">出勤</Typography>
        </Button>

        <Button
          disabled={status !== 'working'}
          onClick={() => onAction('break', '休憩開始')}
          size="lg"
          variant={status === 'working' ? 'solid' : 'outline'}
          intent={status === 'working' ? 'warning' : 'primary'}
          className="h-24"
        >
          <Coffee size={24} />
          <Typography variant="label">休憩</Typography>
        </Button>

        <Button
          disabled={status !== 'break'}
          onClick={() => onAction('working', '休憩終了')}
          size="lg"
          variant={status === 'break' ? 'solid' : 'outline'}
          intent="primary"
          className="h-24"
        >
          <CheckCircle2 size={24} />
          <Typography variant="label">戻り</Typography>
        </Button>

        <Button
          disabled={status === 'out'}
          onClick={() => onAction('out', '退勤')}
          size="lg"
          variant={status !== 'out' ? 'solid' : 'outline'}
          intent="primary"
          className="h-24 bg-gray-900"
        >
          <LogOut size={24} />
          <Typography variant="label">退勤</Typography>
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's History */}
        <Card variant="elevated" padding="none" className="col-span-1 md:col-span-2 overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <Typography variant="h3" className="flex items-center gap-2 font-bold">
              <History size={18} className="text-gray-400" />
              本日の履歴
            </Typography>
            <Typography variant="small" intent="muted">直近3件を表示</Typography>
          </div>
          <CardContent className="p-6">
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {lastAction ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-1.5 h-10 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <Typography variant="label">{lastAction.type}</Typography>
                      <Typography variant="small" intent="muted">打刻完了</Typography>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900 tracking-tight">{lastAction.time}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-4">
                    <Typography variant="small" intent="muted">本日の打刻履歴はありません</Typography>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <Card padding="lg" intent="primary" className="border-none shadow-sm rounded-3xl text-white">
          <div className="h-full flex flex-col justify-between">
            <div>
              <Typography variant="small" intent="white" className="opacity-80 mb-1 font-medium">現在の勤務時間</Typography>
              <Typography variant="h3" intent="white" className="text-4xl mb-6 font-black tracking-tight">
                {status === 'working' ? '05:24' : status === 'break' ? '05:00' : '00:00'}
              </Typography>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-blue-500/50">
              <div className="flex items-center justify-between">
                <Typography variant="small" className="text-blue-100">休憩合計</Typography>
                <Typography variant="label" intent="white">00:45</Typography>
              </div>
              <div className="flex items-center justify-between">
                <Typography variant="small" className="text-blue-100">残業予定</Typography>
                <Typography variant="label" intent="white">00:00</Typography>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
