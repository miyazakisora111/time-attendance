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
        $sql = <<<EOQ
WITH params AS ( 
    SELECT
        '{5e58b918-feac-4fec-94eb-5e6cb5a02d6b}'::uuid AS user_id
        , standard_work_minutes::int AS standard_work_minutes
) 
, attendances_cte AS ( 
    SELECT
        a1.id
        , a1.user_id
        , a1.work_date
        , a1.clock_in_at
        , a1.clock_out_at
        , ROW_NUMBER() OVER (ORDER BY a1.clock_in_at DESC) AS rank
    FROM
        attendances a1 
        CROSS JOIN params 
    WHERE
        a1.user_id = params.user_id
) 
, attendance_breaks_cte AS ( 
    SELECT
        ac1.id
        , SUM(ab1.break_end_at - ab1.break_start_at) AS break_time
    FROM
        attendances_cte ac1 
        LEFT JOIN attendance_breaks ab1 
            ON ac1.id = ab1.attendance_id 
    WHERE
        EXISTS ( 
            SELECT
                1 
            FROM
                attendances_cte ac2 
            WHERE
                ac2.user_id = ac1.user_id 
                AND ac2.work_date = ac1.work_date 
                AND ac2.id <> ac1.id
        ) 
    GROUP BY
        ac1.id
) 
SELECT
    MIN(ac1.clock_in_at) AS clock_in_at
    , MAX(ac1.clock_out_at) FILTER (WHERE rank = 1) AS clock_out_at
    , SUM(abc1.work_time) AS work_time
    , SUM(abc1.break_time) AS break_time 
FROM
    attendances_cte ac1 
    CROSS JOIN params
    LEFT JOIN LATERAL ( 
        SELECT
            abc1.*
            , ac1.clock_out_at - ac1.clock_in_at - abc1.break_time AS work_time 
        FROM
            attendance_breaks_cte abc1
    ) abc1 
        ON ac1.id = abc1.id
EOQ;

        $params = [
            'user_id' => $userId,
            'standard_work_minutes' => config('attendance.standard_work_minutes'),
        ];
        return DB::selectOne($sql, $params);
    }
}
