import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Shield,
  History,
} from 'lucide-react';
import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import type { ClockStatus } from '@/domain/attendance/attendance';
import { Card, CardContent, Container, Typography, IconWrapper, Clock } from '@/shared/components';
import { ClockActionButtons } from '@/shared/components/buttons/ClockActionButtons';
import { AsyncDataState } from '@/shared/components/states/AsyncDataState';
import { EMPTY_TIME_TEXT } from '@/shared/presentation/format';
import { STATUS_ICON_MAP } from '@/shared/presentation/attendance/attendanceStatus';
import { stack } from '@/shared/design-system/layout';
import type { AttendanceStatus } from '@/domain/attendance/attendance';
import type { AttendanceStatusView } from '@/features/attendance/ui/types';

const ATTENDANCE_STATUS_VIEW_MAP: Record<AttendanceStatus, AttendanceStatusView> = {
  working: {
    title: '勤務中',
    description: '今日も順調に業務が進んでいます。適度に休憩を取りましょう。',
    intent: 'primary',
  },
  break: {
    title: '休憩中',
    description: 'リフレッシュして、次の業務に備えましょう。',
    intent: 'warning',
  },
  out: {
    title: '未出勤',
    description: '業務を開始する準備はできましたか？',
    intent: 'muted',
  },
};

/**
 * 勤怠画面
 */
export function AttendancePage() {
  const {
    status,
    lastAction,
    isLoading,
    isError,
    isPending,
    todayWorkedTime,
    handleAction,
  } = useAttendance();

  // ステータスに応じたビュー/アイコン
  const currentStatus = ATTENDANCE_STATUS_VIEW_MAP[status];
  const currentStatusIcon = STATUS_ICON_MAP[status];
  const clockActionStatus: ClockStatus = status === 'working' ? 'in' : status;

  return (
    <Container size="full">
      <div className={`max-w-4xl mx-auto ${stack.xl}`}>
        <Card variant="elevated" padding="lg" unstableClassName="relative overflow-hidden border-gray-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Clock title={undefined} size="md" />
              </motion.div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-300" />
                  <Typography variant="small" intent="muted">
                    東京都港区港南 / Office-A
                  </Typography>
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-200" />
                <span className="flex items-center gap-1.5">
                  <Shield size={14} className="text-gray-300" />
                  <Typography variant="small" intent="muted">
                    IP: 192.168.1.xxx
                  </Typography>
                </span>
              </div>
            </div>
            <div className="w-full md:w-72">
              <Card
                variant="flat"
                intent={currentStatus.intent}
                padding="md"
                unstableClassName="transition-colors duration-500"
              >
                <div className="flex flex-col items-center text-center">
                  <IconWrapper
                    icon={currentStatusIcon.icon}
                    size={32}
                    strokeWidth={2.5}
                    iconColor={currentStatusIcon.iconColor}
                    bgColor="bg-white shadow-sm"
                    unstableClassName="w-16 h-16 mb-4 rounded-2xl"
                  />
                  <Typography variant="h3" intent={currentStatus.intent} unstableClassName="mb-2">
                    {currentStatus.title}
                  </Typography>
                  <Typography
                    variant="small"
                    intent={currentStatus.intent}
                    align="center"
                    unstableClassName="block leading-relaxed"
                  >
                    {currentStatus.description}
                  </Typography>
                </div>
              </Card>
            </div>
          </div>
        </Card>
        <div className="rounded-3xl border border-gray-100 bg-white p-6">
          <ClockActionButtons
            status={clockActionStatus}
            isPending={isLoading || isPending}
            onAction={handleAction}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" padding="none" unstableClassName="col-span-1 md:col-span-2 overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <Typography variant="h3" unstableClassName="flex items-center gap-2">
                <History size={18} className="text-gray-400" />
                本日の履歴
              </Typography>
              <Typography variant="small" intent="muted">
                直近3件を表示
              </Typography>
            </div>
            <CardContent unstableClassName="p-6">
              <div className={stack.lg}>
                <AsyncDataState
                  isLoading={isLoading}
                  isError={isError}
                  isEmpty={!lastAction}
                >
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-1.5 h-10 rounded-full bg-blue-500" />
                      <div className="flex-1">
                        <Typography variant="label">{lastAction?.type}</Typography>
                        <Typography variant="small" intent="muted">
                          打刻完了
                        </Typography>
                      </div>
                      <div className="text-right">
                        <Typography variant="h3" unstableClassName="tracking-tight tabular-nums">
                          {lastAction?.time}
                        </Typography>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </AsyncDataState>
              </div>
            </CardContent>
          </Card>
          <Card padding="lg" intent="primary" unstableClassName="border-none shadow-sm rounded-3xl text-white">
            <div className="flex flex-col justify-between h-full">
              <div>
                <Typography variant="small" intent="white" unstableClassName="opacity-80 mb-1 font-medium">
                  現在の勤務時間
                </Typography>
                <Typography variant="h3" intent="white" unstableClassName="mb-6 tracking-tight">
                  {todayWorkedTime ?? EMPTY_TIME_TEXT}
                </Typography>
              </div>
              <div className={`${stack.md} pt-6 border-t border-blue-500/50`}>
                <div className="flex items-center justify-between">
                  <Typography variant="small" unstableClassName="text-blue-100">
                    休憩合計
                  </Typography>
                  <Typography variant="label" intent="white">
                    {EMPTY_TIME_TEXT}
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Typography variant="small" unstableClassName="text-blue-100">
                    残業予定
                  </Typography>
                  <Typography variant="label" intent="white">
                    00:00
                  </Typography>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
