CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(128) NOT NULL,
  role VARCHAR(40) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(160) NOT NULL,
  project_name VARCHAR(180) NOT NULL,
  status VARCHAR(40) NOT NULL,
  budget NUMERIC(12, 2) NOT NULL,
  health_score INTEGER NOT NULL,
  stack VARCHAR(400) NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id VARCHAR(80) PRIMARY KEY,
  project_id UUID NULL REFERENCES projects(id),
  actor VARCHAR(120) NOT NULL,
  action VARCHAR(80) NOT NULL,
  message VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_projects_status_due_date ON projects(status, due_date);
CREATE INDEX IF NOT EXISTS ix_projects_client_name ON projects(client_name);
CREATE INDEX IF NOT EXISTS ix_audit_events_created_at ON audit_events(created_at DESC);
