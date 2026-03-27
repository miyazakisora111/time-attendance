<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class AttendanceRepository
{
    /**
     * 勤怠を取得する。
     */
    public function getAttendances(int $userId)
    {
        $sql = <<<SQL
SELECT
    a1.*
    , ab1.* 
FROM
    attendances a1 
    LEFT JOIN attendance_breaks ab1 
        ON a1.id = ab1.attendance_id 
WHERE
    a1.user_id = :user_id
    AND EXISTS ( 
        SELECT
            1 
        FROM
            attendances a2 
        WHERE
            a2.user_id = a1.user_id 
            AND a2.work_date = a1.work_date 
            AND a2.id <> a1.id
    ) 
ORDER BY
    a1.work_date
    , a1.id
SQL;

        $params = [
            'user_id' => $userId,
            'standard_work_minutes' => config('attendance.standard_work_minutes'),
        ];
        return DB::select($sql, $params);
    }

    /**
     * 指定ユーザーの月別勤怠サマリー
     */
    public function getMonthlySummary(int $userId, string $month): array
    {
        $result = DB::selectOne(
            '
            SELECT
                COUNT(*) AS work_days,
                COALESCE(SUM(work_minutes), 0) AS total_work_minutes,
                COALESCE(SUM(break_minutes), 0) AS total_break_minutes
            FROM attendances
            WHERE user_id = ?
              AND DATE_FORMAT(work_date, "%Y-%m") = ?
            ',
            [$userId, $month]
        );

        return [
            'work_days'           => (int) $result->work_days,
            'total_work_minutes'  => (int) $result->total_work_minutes,
            'total_break_minutes' => (int) $result->total_break_minutes,
        ];
    }
}
