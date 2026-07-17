import type {
  AuditEvent,
  DashboardSummary,
  PaginatedResult,
  Project,
  ProjectFilters,
  User,
} from '../types/domain';

export interface ProjectRepository {
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(userId: string): Promise<User | undefined>;
  getDashboardSummary(): Promise<DashboardSummary>;
  getProjects(filters: ProjectFilters): Promise<PaginatedResult<Project>>;
  getProjectById(projectId: string): Promise<Project | undefined>;
  getAuditEvents(): Promise<AuditEvent[]>;
  getHealth(): Promise<{status: string; databaseProvider: string; optimizedApi: boolean}>;
}
