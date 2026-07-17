import {DEMO_AUDIT_EVENTS, DEMO_PROJECTS, DEMO_USERS} from '../demoData';
import {getMssqlPool, type MssqlConfig} from './getMssqlPool';

export async function initializeMssqlDatabase(config: MssqlConfig): Promise<void> {
  const pool = await getMssqlPool(config);

  await pool.request().query(`
    IF OBJECT_ID(N'dbo.users', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.users (
        id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(120) NOT NULL,
        email NVARCHAR(180) NOT NULL UNIQUE,
        password_hash NVARCHAR(128) NOT NULL,
        role NVARCHAR(40) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;

    IF OBJECT_ID(N'dbo.projects', N'U') IS NULL
    BEGIN
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
    END;

    IF OBJECT_ID(N'dbo.audit_events', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.audit_events (
        id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
        project_id UNIQUEIDENTIFIER NULL,
        actor NVARCHAR(120) NOT NULL,
        action NVARCHAR(80) NOT NULL,
        message NVARCHAR(500) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_audit_project FOREIGN KEY (project_id) REFERENCES dbo.projects(id)
      );
    END;

    IF NOT EXISTS (
      SELECT 1 FROM sys.indexes
      WHERE name = N'ix_projects_status_due_date'
        AND object_id = OBJECT_ID(N'dbo.projects')
    )
    BEGIN
      CREATE INDEX ix_projects_status_due_date ON dbo.projects(status, due_date);
    END;

    IF NOT EXISTS (
      SELECT 1 FROM sys.indexes
      WHERE name = N'ix_projects_client_name'
        AND object_id = OBJECT_ID(N'dbo.projects')
    )
    BEGIN
      CREATE INDEX ix_projects_client_name ON dbo.projects(client_name);
    END;

    IF NOT EXISTS (
      SELECT 1 FROM sys.indexes
      WHERE name = N'ix_audit_events_created_at'
        AND object_id = OBJECT_ID(N'dbo.audit_events')
    )
    BEGIN
      CREATE INDEX ix_audit_events_created_at ON dbo.audit_events(created_at DESC);
    END;
  `);

  await seedUsers(pool);
  await seedProjects(pool);
  await seedAuditEvents(pool);
}

async function seedUsers(pool: any): Promise<void> {
  for (const user of DEMO_USERS) {
    await pool
      .request()
      .input('id', user.id)
      .input('name', user.name)
      .input('email', user.email)
      .input('passwordHash', user.passwordHash)
      .input('role', user.role)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE email = @email)
        BEGIN
          INSERT INTO dbo.users (id, name, email, password_hash, role)
          VALUES (@id, @name, @email, @passwordHash, @role);
        END;
      `);
  }
}

async function seedProjects(pool: any): Promise<void> {
  for (const project of DEMO_PROJECTS) {
    await pool
      .request()
      .input('id', project.id)
      .input('clientName', project.clientName)
      .input('projectName', project.projectName)
      .input('status', project.status)
      .input('budget', project.budget)
      .input('healthScore', project.healthScore)
      .input('stack', project.stack.join(','))
      .input('dueDate', project.dueDate)
      .input('updatedAt', new Date(project.updatedAt))
      .query(`
        IF NOT EXISTS (SELECT 1 FROM dbo.projects WHERE id = @id)
        BEGIN
          INSERT INTO dbo.projects (
            id,
            client_name,
            project_name,
            status,
            budget,
            health_score,
            stack,
            due_date,
            updated_at
          )
          VALUES (
            @id,
            @clientName,
            @projectName,
            @status,
            @budget,
            @healthScore,
            @stack,
            @dueDate,
            @updatedAt
          );
        END;
      `);
  }
}

async function seedAuditEvents(pool: any): Promise<void> {
  for (const event of DEMO_AUDIT_EVENTS) {
    await pool
      .request()
      .input('actor', event.actor)
      .input('action', event.action)
      .input('message', event.message)
      .input('createdAt', new Date(event.createdAt))
      .query(`
        IF NOT EXISTS (
          SELECT 1 FROM dbo.audit_events
          WHERE action = @action AND message = @message
        )
        BEGIN
          INSERT INTO dbo.audit_events (actor, action, message, created_at)
          VALUES (@actor, @action, @message, @createdAt);
        END;
      `);
  }
}
