import { useState, useEffect } from 'react';
import { toast as sonner } from 'sonner';
import type { AttendanceStatus, LastAction } from '@/domain/enums/attendance';

export const useAttendance = () => {
  const [status, setStatus] = useState<AttendanceStatus>('out');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = (type: AttendanceStatus, label: string) => {
    const now = new Date().toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setStatus(type);
    setLastAction({ type: label, time: now });
    sonner.success(`${label}しました (${now})`, {
      description: '本日の勤務データに記録されました。',
    });
  };

  return {
    status,
    currentTime,
    lastAction,
    handleAction,
  };
};
