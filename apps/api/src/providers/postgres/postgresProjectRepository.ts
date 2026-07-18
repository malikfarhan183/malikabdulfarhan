import type {
  AuditEvent,
  DashboardSummary,
  PaginatedResult,
  Project,
  ProjectFilters,
  User,
} from '../../types/domain';
import type {ProjectRepository} from '../projectRepository';
import {getPostgresPool, type PostgresConfig} from './getPostgresPool';

export class PostgresProjectRepository implements ProjectRepository {
  constructor(private readonly config: PostgresConfig) {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    const pool = await getPostgresPool(this.config);
    const result = await pool.query(
      `SELECT id::text, name, email, password_hash, role
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email]
    );

    return result.rows[0] ? mapUser(result.rows[0]) : undefined;
  }

  async getUserById(userId: string): Promise<User | undefined> {
    const pool = await getPostgresPool(this.config);
    const result = await pool.query(
      `SELECT id::text, name, email, password_hash, role
       FROM users
       WHERE id::text = $1
       LIMIT 1`,
      [userId]
    );

    return result.rows[0] ? mapUser(result.rows[0]) : undefined;
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const pool = await getPostgresPool(this.config);
    const result = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'active') AS active_projects,
        COALESCE(SUM(budget), 0) AS total_budget,
        COALESCE(AVG(health_score::FLOAT), 0) AS average_health
       FROM projects`
    );
    const row = result.rows[0];

    return {
      activeProjects: Number(row.active_projects || 0),
      totalBudget: Number(row.total_budget || 0),
      averageHealth: Math.round(Number(row.average_health || 0)),
      apiLatency: 36,
    };
  }

  async getProjects(filters: ProjectFilters): Promise<PaginatedResult<Project>> {
    const pool = await getPostgresPool(this.config);
    const values: unknown[] = [];
    const whereClauses: string[] = [];

    if (filters.status) {
      values.push(filters.status);
      whereClauses.push(`status = $${values.length}`);
    }

    if (filters.search) {
      values.push(`%${filters.search}%`);
      whereClauses.push(
        `(client_name ILIKE $${values.length} OR project_name ILIKE $${values.length} OR stack ILIKE $${values.length})`
      );
    }

    values.push(filters.size);
    const limitIndex = values.length;
    values.push((filters.page - 1) * filters.size);
    const offsetIndex = values.length;
    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT id::text, client_name, project_name, status, budget, health_score, stack, due_date, updated_at,
        COUNT(*) OVER() AS total_count
       FROM projects
       ${whereSql}
       ORDER BY due_date ASC
       LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
      values
    );
    const totalCount = Number(result.rows[0]?.total_count || 0);

    return {
      data: result.rows.map(mapProject),
      paginationOptions: {
        page: filters.page,
        size: filters.size,
        totalPages: Math.max(Math.ceil(totalCount / filters.size), 1),
      },
    };
  }

  async getProjectById(projectId: string): Promise<Project | undefined> {
    const pool = await getPostgresPool(this.config);
    const result = await pool.query(
      `SELECT id::text, client_name, project_name, status, budget, health_score, stack, due_date, updated_at
       FROM projects
       WHERE id::text = $1
       LIMIT 1`,
      [projectId]
    );

    return result.rows[0] ? mapProject(result.rows[0]) : undefined;
  }

  async getAuditEvents(): Promise<AuditEvent[]> {
    const pool = await getPostgresPool(this.config);
    const result = await pool.query(
      `SELECT id, project_id::text, actor, action, message, created_at
       FROM audit_events
       ORDER BY created_at DESC
       LIMIT 20`
    );

    return result.rows.map(mapAuditEvent);
  }

  async getHealth(): Promise<{status: string; databaseProvider: string; optimizedApi: boolean}> {
    const pool = await getPostgresPool(this.config);
    await pool.query('SELECT 1 AS ok');

    return {
      status: 'ok',
      databaseProvider: 'postgres',
      optimizedApi: true,
    };
  }
}

function mapUser(row: any): User {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
  };
}

function mapProject(row: any): Project {
  return {
    id: String(row.id),
    clientName: row.client_name,
    projectName: row.project_name,
    status: row.status,
    budget: Number(row.budget),
    healthScore: Number(row.health_score),
    stack: String(row.stack || '').split(',').filter(Boolean),
    dueDate: new Date(row.due_date).toISOString().slice(0, 10),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function mapAuditEvent(row: any): AuditEvent {
  return {
    id: String(row.id),
    projectId: row.project_id ? String(row.project_id) : undefined,
    actor: row.actor,
    action: row.action,
    message: row.message,
    createdAt: new Date(row.created_at).toISOString(),
  };
}
