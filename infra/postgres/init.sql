-- ============================================================
-- PostgreSQL initialization for Docker
-- ============================================================
-- Database and role are auto-created by the Postgres image
-- from POSTGRES_DB / POSTGRES_USER / POSTGRES_PASSWORD env vars.
-- This script runs additional setup on the created database.
-- ============================================================

-- Ensure the app user owns the public schema
ALTER SCHEMA public OWNER TO CURRENT_USER;

-- Default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO CURRENT_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO CURRENT_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO CURRENT_USER;

-- Useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
