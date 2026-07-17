CREATE DATABASE ClientOpsStudio;
GO

USE ClientOpsStudio;
GO

CREATE TABLE dbo.users (
  id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
  name NVARCHAR(120) NOT NULL,
  email NVARCHAR(180) NOT NULL UNIQUE,
  password_hash NVARCHAR(128) NOT NULL,
  role NVARCHAR(40) NOT NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.projects (
  id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
  client_name NVARCHAR(160) NOT NULL,
  project_name NVARCHAR(180) NOT NULL,
  status NVARCHAR(40) NOT NULL,
  budget DECIMAL(12, 2) NOT NULL,
  health_score INT NOT NULL,
  stack NVARCHAR(400) NOT NULL,
  due_date DATE NOT NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.audit_events (
  id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
  project_id UNIQUEIDENTIFIER NULL,
  actor NVARCHAR(120) NOT NULL,
  action NVARCHAR(80) NOT NULL,
  message NVARCHAR(500) NOT NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT fk_audit_project FOREIGN KEY (project_id) REFERENCES dbo.projects(id)
);

CREATE INDEX ix_projects_status_due_date ON dbo.projects(status, due_date);
CREATE INDEX ix_projects_client_name ON dbo.projects(client_name);
CREATE INDEX ix_audit_events_created_at ON dbo.audit_events(created_at DESC);
