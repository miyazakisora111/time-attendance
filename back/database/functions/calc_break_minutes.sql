CREATE OR REPLACE FUNCTION calc_break_minutes(
    break_start TIMESTAMP,
    break_end   TIMESTAMP
)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
    -- 休憩開始・終了時刻から休憩分数を算出する
    -- 日付を跨ぐ場合（負の差分）は 24時間（1440分）を加算する
    SELECT
        CASE
            WHEN break_start IS NULL OR break_end IS NULL THEN 0
            WHEN EXTRACT(EPOCH FROM (break_end - break_start)) / 60 >= 0
            THEN (EXTRACT(EPOCH FROM (break_end - break_start)) / 60)::int
            ELSE (EXTRACT(EPOCH FROM (break_end - break_start)) / 60)::int + 1440
        END;
$$;

COMMENT ON FUNCTION calc_break_minutes(TIMESTAMP, TIMESTAMP)
IS '休憩開始・終了時刻から休憩時間（分）を算出する。23:00→00:30 のような日跨ぎを考慮する。';