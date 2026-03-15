import React from 'react';

type Props = {
  clockStatus: 'out' | 'working' | 'break';
  onClockIn: () => void;
  onClockOut: () => void;
};

export const AttendancePunchCard: React.FC<Props> = ({
  clockStatus,
  onClockIn,
  onClockOut,
}) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">打刻</h2>
      <p className="mt-1 text-sm text-gray-600">進行中の勤務は日を跨いでも同一レコードで扱います。</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onClockIn}
          disabled={clockStatus !== 'out'}
          className="rounded-lg bg-blue-600 px-4 py-3 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          出勤
        </button>
        <button
          type="button"
          onClick={onClockOut}
          disabled={clockStatus === 'out'}
          className="rounded-lg bg-gray-900 px-4 py-3 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          退勤
        </button>
      </div>
    </section>
  );
};
