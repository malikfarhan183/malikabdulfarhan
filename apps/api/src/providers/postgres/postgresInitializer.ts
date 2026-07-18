import {DEMO_AUDIT_EVENTS, DEMO_PROJECTS, DEMO_USERS} from '../demoData';
import {getPostgresPool, type PostgresConfig} from './getPostgresPool';

export async function initializePostgresDatabase(config: PostgresConfig): Promise<void> {
  const pool = await getPostgresPool(config);

  await pool.query(`
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
  `);

  await seedUsers(pool);
  await seedProjects(pool);
  await seedAuditEvents(pool);
}

async function seedUsers(pool: any): Promise<void> {
  for (const user of DEMO_USERS) {
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      [user.id, user.name, user.email, user.passwordHash, user.role]
    );
  }
}

async function seedProjects(pool: any): Promise<void> {
  for (const project of DEMO_PROJECTS) {
    await pool.query(
      `INSERT INTO projects (
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING`,
      [
        project.id,
        project.clientName,
        project.projectName,
        project.status,
        project.budget,
        project.healthScore,
        project.stack.join(','),
        project.dueDate,
        new Date(project.updatedAt),
      ]
    );
  }
}

async function seedAuditEvents(pool: any): Promise<void> {
  for (const event of DEMO_AUDIT_EVENTS) {
    await pool.query(
      `INSERT INTO audit_events (id, actor, action, message, created_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [event.id, event.actor, event.action, event.message, new Date(event.createdAt)]
    );
  }
}
