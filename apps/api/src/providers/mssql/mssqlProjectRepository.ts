import type {
  AuditEvent,
  DashboardSummary,
  PaginatedResult,
  Project,
  ProjectFilters,
  User,
} from '../../types/domain';
import type {ProjectRepository} from '../projectRepository';
import {getMssqlPool, type MssqlConfig} from './getMssqlPool';

export class MssqlProjectRepository implements ProjectRepository {
  constructor(private readonly config: MssqlConfig) {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    const pool = await getMssqlPool(this.config);
    const result = await pool
      .request()
      .input('email', email)
      .query(
        `SELECT TOP 1 id, name, email, password_hash, role
         FROM dbo.users
         WHERE email = @email`
      );

    return result.recordset[0] ? mapUser(result.recordset[0]) : undefined;
  }

  async getUserById(userId: string): Promise<User | undefined> {
    const pool = await getMssqlPool(this.config);
    const result = await pool
      .request()
      .input('id', userId)
      .query(
        `SELECT TOP 1 id, name, email, password_hash, role
         FROM dbo.users
         WHERE id = @id`
      );

    return result.recordset[0] ? mapUser(result.recordset[0]) : undefined;
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const pool = await getMssqlPool(this.config);
    const result = await pool.request().query(
      `SELECT
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeProjects,
        SUM(budget) AS totalBudget,
        AVG(CAST(health_score AS FLOAT)) AS averageHealth
       FROM dbo.projects`
    );
    const row = result.recordset[0];

    return {
      activeProjects: Number(row.activeProjects || 0),
      totalBudget: Number(row.totalBudget || 0),
      averageHealth: Math.round(Number(row.averageHealth || 0)),
      apiLatency: 38,
    };
  }

  async getProjects(filters: ProjectFilters): Promise<PaginatedResult<Project>> {
    const pool = await getMssqlPool(this.config);
    const offset = (filters.page - 1) * filters.size;
    const request = pool.request().input('offset', offset).input('size', filters.size);
    const whereClauses = [];

    if (filters.status) {
      request.input('status', filters.status);
      whereClauses.push('status = @status');
    }

    if (filters.search) {
      request.input('search', `%${filters.search}%`);
      whereClauses.push('(client_name LIKE @search OR project_name LIKE @search OR stack LIKE @search)');
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const result = await request.query(
      `SELECT id, client_name, project_name, status, budget, health_score, stack, due_date, updated_at,
        COUNT(*) OVER() AS total_count
       FROM dbo.projects
       ${whereSql}
       ORDER BY due_date ASC
       OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY`
    );
    const rows = result.recordset;
    const totalCount = Number(rows[0]?.total_count || 0);

    return {
      data: rows.map(mapProject),
      paginationOptions: {
        page: filters.page,
        size: filters.size,
        totalPages: Math.max(Math.ceil(totalCount / filters.size), 1),
      },
    };
  }

  async getProjectById(projectId: string): Promise<Project | undefined> {
    const pool = await getMssqlPool(this.config);
    const result = await pool
      .request()
      .input('id', projectId)
      .query(
        `SELECT id, client_name, project_name, status, budget, health_score, stack, due_date, updated_at
         FROM dbo.projects
         WHERE id = @id`
      );

    return result.recordset[0] ? mapProject(result.recordset[0]) : undefined;
  }

  async getAuditEvents(): Promise<AuditEvent[]> {
    const pool = await getMssqlPool(this.config);
    const result = await pool.request().query(
      `SELECT TOP 20 id, project_id, actor, action, message, created_at
       FROM dbo.audit_events
       ORDER BY created_at DESC`
    );

    return result.recordset.map(mapAuditEvent);
  }

  async getHealth(): Promise<{status: string; databaseProvider: string; optimizedApi: boolean}> {
    const pool = await getMssqlPool(this.config);
    await pool.request().query('SELECT 1 AS ok');

    return {
      status: 'ok',
      databaseProvider: 'mssql',
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
