import { useEffect, useState } from 'react';

/** 現在時刻を提供する hook */
export const useNow = (intervalMs: number = 1000): Date => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};