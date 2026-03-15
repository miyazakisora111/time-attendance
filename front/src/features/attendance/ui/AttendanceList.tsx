import React from 'react';
import { computeWorkedMinutes, formatLocalDateTime, formatMinutes, isCrossDayShift, type AttendanceRow } from '@/features/attendance/lib/timeCalc';

type Props = {
  rows: AttendanceRow[];
};

export const AttendanceList: React.FC<Props> = ({ rows }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">勤務日</th>
            <th className="px-4 py-3 text-left">出勤</th>
            <th className="px-4 py-3 text-left">退勤</th>
            <th className="px-4 py-3 text-left">日跨ぎ</th>
            <th className="px-4 py-3 text-right">休憩</th>
            <th className="px-4 py-3 text-right">実働</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const workedMinutes = computeWorkedMinutes(row);
            return (
              <tr key={row.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{row.workDate}</td>
                <td className="px-4 py-3">{formatLocalDateTime(row.clockInAt, row.workTimezone)}</td>
                <td className="px-4 py-3">{formatLocalDateTime(row.clockOutAt, row.workTimezone)}</td>
                <td className="px-4 py-3">{isCrossDayShift(row) ? '翌日退勤' : '-'}</td>
                <td className="px-4 py-3 text-right">{formatMinutes(row.breakMinutes)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatMinutes(workedMinutes)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
