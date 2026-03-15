import React from 'react';

type Props = {
  onSubmit: (payload: {
    workDate: string;
    clockInLocalTime: string;
    clockOutLocalTime: string;
    clockOutNextDay: boolean;
    workTimezone: string;
    breakMinutes: number;
  }) => void;
};

export const AttendanceEditForm: React.FC<Props> = ({ onSubmit }) => {
  const [workDate, setWorkDate] = React.useState('');
  const [clockIn, setClockIn] = React.useState('09:00');
  const [clockOut, setClockOut] = React.useState('18:00');
  const [clockOutNextDay, setClockOutNextDay] = React.useState(false);
  const [timezone, setTimezone] = React.useState('Asia/Tokyo');
  const [breakMinutes, setBreakMinutes] = React.useState(60);

  return (
    <form
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          workDate,
          clockInLocalTime: clockIn,
          clockOutLocalTime: clockOut,
          clockOutNextDay,
          workTimezone: timezone,
          breakMinutes,
        });
      }}
    >
      <h2 className="text-lg font-bold text-gray-900">勤怠修正</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          勤務日
          <input
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </label>
        <label className="text-sm">
          タイムゾーン
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </label>
        <label className="text-sm">
          出勤(ローカル時刻)
          <input
            type="time"
            value={clockIn}
            onChange={(e) => setClockIn(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />
        </label>
        <label className="text-sm">
          退勤(ローカル時刻)
          <input
            type="time"
            value={clockOut}
            onChange={(e) => setClockOut(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={clockOutNextDay}
          onChange={(e) => setClockOutNextDay(e.target.checked)}
        />
        退勤は翌日
      </label>

      <label className="text-sm block">
        休憩(分)
        <input
          type="number"
          min={0}
          max={720}
          value={breakMinutes}
          onChange={(e) => setBreakMinutes(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          required
        />
      </label>

      <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
        保存
      </button>
    </form>
  );
};
