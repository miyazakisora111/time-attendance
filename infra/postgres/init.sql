-- ─────────────────────────────────────────────────────────────
-- ① ロール（ユーザー）作成：存在チェック付き（DOブロック）
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'time_attendance') THEN
    CREATE ROLE time_attendance LOGIN PASSWORD 'change_me';
  END IF;
END$$;

-- ─────────────────────────────────────────────────────────────
-- ② データベース作成：存在しなければ作成（psql専用の \gexec を使用）
--    ※ CREATE DATABASE は DO 内では実行できないため
-- ─────────────────────────────────────────────────────────────
SELECT 'CREATE DATABASE time_attendance OWNER time_attendance'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'time_attendance')
\gexec

-- ─────────────────────────────────────────────────────────────
-- ③ 対象DBに接続（psqlメタコマンド。pgAdminでは使えません）
-- ─────────────────────────────────────────────────────────────
\connect time_attendance

-- ─────────────────────────────────────────────────────────────
-- ④ 拡張作成（要スーパーユーザー）
-- ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ─────────────────────────────────────────────────────────────
-- ⑤ 以降はアプリユーザー権限で実施
-- ─────────────────────────────────────────────────────────────
SET ROLE time_attendance;

-- Ensure the app user owns the public schema
ALTER SCHEMA public OWNER TO CURRENT_USER;

-- Default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO CURRENT_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO CURRENT_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO CURRENT_USER;

-- Full privileges on public schema (dev convenience)
GRANT ALL PRIVILEGES ON SCHEMA public TO CURRENT_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO CURRENT_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO CURRENT_USER;