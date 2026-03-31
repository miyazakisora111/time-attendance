SELECT
    ab.*
FROM
    attendance_breaks ab
    INNER JOIN attendances a
        ON ab.attendance_id = a.id
WHERE
    a.user_id = :user_id
    AND a.work_date = :work_date
    AND ab.break_start_at IS NOT NULL
    AND ab.break_end_at IS NOT NULL
