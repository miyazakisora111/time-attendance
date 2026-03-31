WITH params AS ( 
    SELECT
        :user_id::uuid AS user_id
        , :work_date::date AS work_date
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
        AND a1.work_date = params.work_date
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
    (SELECT x.user_id FROM params x) AS user_id
    , (SELECT x.work_date FROM params x) AS work_date
    , MIN(ac1.clock_in_at) AS clock_in_at
    , MAX(ac1.clock_out_at) FILTER (WHERE rank = 1) AS clock_out_at
    , SUM(abc1.work_time) AS worked_minutes
    , SUM(abc1.break_time) AS break_minutes
FROM
    attendances_cte ac1
    LEFT JOIN LATERAL ( 
        SELECT
            abc1.*
            , ac1.clock_out_at - ac1.clock_in_at - abc1.break_time AS work_time 
        FROM
            attendance_breaks_cte abc1
    ) abc1 
        ON ac1.id = abc1.id