import React, { useState, useEffect } from "react";

export const ClockDisplay = React.memo(function ClockDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
      <p className="text-sm text-gray-600 mb-2">現在時刻</p>
      <p className="text-4xl mb-1 font-bold text-gray-900 tabular-nums tracking-tight">
        {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>
      <p className="text-sm text-gray-600">
        {currentTime.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
      </p>
    </div>
  );
});
