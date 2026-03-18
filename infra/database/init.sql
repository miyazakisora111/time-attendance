-- 変数: dbname, dbuser, dbpass (psql -v で注入)

-- ロール（ユーザー）作成
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'dbuser') THEN
    EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', :'dbuser', :'dbpass');
  END IF;
END
$$;

-- データベース作成
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'dbname') THEN
    EXECUTE format('CREATE DATABASE %I OWNER %I TEMPLATE template1', :'dbname', :'dbuser');
  END IF;
END
$$;

-- 明示的に public スキーマへの権限を整理
ALTER DATABASE :dbname OWNER TO :dbuser;

-- 新しく作るオブジェクトのデフォルト権限
\connect :dbname

-- public スキーマの所有者をアプリユーザーにしておく
ALTER SCHEMA public OWNER TO :dbuser;

-- 接続/作成/使用の権限を付与
GRANT CONNECT ON DATABASE :dbname TO :dbuser;
GRANT USAGE ON SCHEMA public TO :dbuser;

-- 既存オブジェクトへの権限
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO :dbuser;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO :dbuser;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO :dbuser;

-- 以後に作られるオブジェクトのデフォルト権限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT
  SELECT, INSERT, UPDATE, DELETE ON TABLES TO :dbuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT
  USAGE, SELECT ON SEQUENCES TO :dbuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT
  EXECUTE ON FUNCTIONS TO :dbuser;