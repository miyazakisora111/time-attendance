import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Shield,
  History,
} from 'lucide-react';
import { useAttendance } from '@/features/attendance/hooks/useAttendance';
import type { AttendanceStatus } from '@/__generated__/enums';
import { Card, CardContent, Container, Typography, IconWrapper, Clock } from '@/shared/components';
import { ClockActionButtons } from '@/shared/components/buttons/ClockActionButtons';
import { AsyncDataState } from '@/shared/components/states/AsyncDataState';
import { formatMinutes } from '@/shared/utils/format';
import { getAttendanceStatusIconView } from '@/shared/presentation/attendance/attendanceStatus';
import { stack } from '@/shared/design-system/layout';

/** 勤怠ステータス */
export interface AttendanceStatusView {
  title: string;
  description: string;
  intent: 'primary' | 'warning' | 'muted';
}
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

// TODO: カードごとに分けようと思ったけど、ステータスに応じた見た目の切り替えが面倒だったので、とりあえず1ページにまとめてる。要リファクタ

/**
 * 勤怠画面
 */
export function AttendancePage() {
  const {
    clockStatus,
    attendanceStatus,
    lastActionView,
    isLoading,
    isError,
    isPending,
    totalWorkedMinutes,
    breakMinutes,
    overtimeMinutes,
    handleAction,
  } = useAttendance();

  // ステータスに応じたビュー/アイコン
  const currentStatus = ATTENDANCE_STATUS_VIEW_MAP[attendanceStatus];
  const currentStatusIcon = getAttendanceStatusIconView(attendanceStatus);

  return (
    <Container size="full">
      <div className={`max-w-4xl mx-auto space-y-8`}>
        <Card
          variant="elevated"
          padding="lg"
          unstableClassName="relative overflow-hidden border-gray-100"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="flat" padding="lg">
              <div className="flex flex-col items-center justify-center h-full">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Clock title={undefined} size="md" />
                </motion.div>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
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
            </Card>
            <Card
              variant="flat"
              intent={currentStatus.intent}
              padding="md"
              unstableClassName="transition-colors duration-500"
            >
              <div className="flex flex-col items-center justify-center text-center h-full">
                <IconWrapper
                  icon={currentStatusIcon.icon}
                  size={32}
                  strokeWidth={2.5}
                  iconColor={currentStatusIcon.iconColor}
                  bgColor="bg-white shadow-sm"
                  unstableClassName="w-16 h-16 mb-4 rounded-2xl"
                />
                <Typography
                  variant="h3"
                  intent={currentStatus.intent}
                  unstableClassName="mb-2"
                >
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
            <Card
              padding="lg"
              intent="primary"
              unstableClassName="border-none shadow-sm rounded-3xl"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <Typography
                    variant="small"
                    unstableClassName="opacity-80 mb-1 font-medium"
                  >
                    現在の勤務時間
                  </Typography>

                  <Typography
                    variant="h3"
                    unstableClassName="mb-6 tracking-tight"
                  >
                    {formatMinutes(totalWorkedMinutes)}
                  </Typography>
                </div>
                <div className="pt-6 border-t border-blue-500/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography variant="small">
                      休憩合計
                    </Typography>
                    <Typography variant="label">
                      {formatMinutes(breakMinutes)}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="small">
                      残業時間
                    </Typography>
                    <Typography variant="label">
                      {formatMinutes(overtimeMinutes)}
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>
            <Card
              padding="lg"
              intent="primary"
              unstableClassName="border-none shadow-sm rounded-3xl"
            >
              <ClockActionButtons
                status={clockStatus}
                isPending={isLoading || isPending}
                onAction={handleAction}
              />
            </Card>
          </div>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" padding="none" unstableClassName="col-span-1 md:col-span-2 overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <Typography variant="h3" unstableClassName="flex items-center gap-2">
                <History size={18} className="text-gray-400" />
                直近の勤怠
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
                  isEmpty={!lastActionView}
                >
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-1.5 h-10 rounded-full bg-blue-500" />
                      <div className="flex-1">
                        <Typography variant="label">{lastActionView?.label}</Typography>
                        <Typography variant="small" intent="muted">
                          打刻完了
                        </Typography>
                      </div>
                      <div className="text-right">
                        <Typography variant="h3" unstableClassName="tracking-tight tabular-nums">
                          {lastActionView?.time}
                        </Typography>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </AsyncDataState>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
