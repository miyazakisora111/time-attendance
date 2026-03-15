# Attendance Cross-Day Design

## Key Policy

- Source of truth is `timestamptz` (`clock_in_at`, `clock_out_at`).
- `work_date` is the local date at shift start in `work_timezone`.
- `time without time zone` (`start_time`, `end_time`) is kept only for backward compatibility.

## Table Definition (`attendances`)

- `id uuid primary key`
- `user_id uuid not null references users(id) on delete cascade`
- `work_date date not null`
- `clock_in_at timestamp with time zone null`
- `clock_out_at timestamp with time zone null`
- `work_timezone varchar(64) not null default 'Asia/Tokyo'`
- `break_minutes integer not null default 0`
- `worked_minutes integer null`
- `note text null`
- `start_time time without time zone null` (legacy)
- `end_time time without time zone null` (legacy)
- `created_at/updated_at/deleted_at timestamptz`

## Constraints

- `chk_attendances_clock_range`:
  - `clock_in_at is null or clock_out_at is null or clock_out_at > clock_in_at`
- `chk_attendances_break_minutes_non_negative`:
  - `break_minutes >= 0`
- `chk_attendances_worked_minutes_non_negative`:
  - `worked_minutes is null or worked_minutes >= 0`
- `chk_attendances_timezone_not_blank`:
  - `length(trim(work_timezone)) > 0`
- Existing uniqueness:
  - `uq_attendances_user_work_date_active` (user_id, work_date) where deleted_at is null

## Indexes

- Existing:
  - `idx_attendances_user_id`
  - `idx_attendances_work_date`
- Added for cross-day query performance:
  - `idx_attendances_user_clock_in_at (user_id, clock_in_at)`
  - `idx_attendances_clock_out_at (clock_out_at)`

## Why This Avoids Drift Across Local/CI/Prod

- Store absolute instants in DB (`timestamptz`), not local wall-clock only values.
- Convert only at API/UI boundary using `work_timezone`.
- Compute minutes from timestamps, not from plain `time` columns.
