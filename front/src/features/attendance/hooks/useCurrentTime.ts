import { useEffect, useState } from 'react';

/**
 * 現在時刻を 1 秒ごとに更新する hook。
 */
export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return currentTime;
};
