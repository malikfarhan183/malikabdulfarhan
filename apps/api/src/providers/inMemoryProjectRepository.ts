import type {
  AuditEvent,
  DashboardSummary,
  PaginatedResult,
  Project,
  ProjectFilters,
  User,
} from '../types/domain';
import {paginate} from '../utils/pagination';
import {DEMO_AUDIT_EVENTS, DEMO_PROJECTS, DEMO_USERS} from './demoData';
import type {ProjectRepository} from './projectRepository';

export class InMemoryProjectRepository implements ProjectRepository {
  private readonly users = DEMO_USERS;
  private readonly projects = DEMO_PROJECTS;
  private readonly auditEvents = DEMO_AUDIT_EVENTS;

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === userId);
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const activeProjects = this.projects.filter((project) => project.status === 'active').length;
    const totalBudget = this.projects.reduce((sum, project) => sum + project.budget, 0);
    const averageHealth = Math.round(
      this.projects.reduce((sum, project) => sum + project.healthScore, 0) /
        this.projects.length
    );

    return {
      activeProjects,
      totalBudget,
      averageHealth,
      apiLatency: 42,
    };
  }

  async getProjects(filters: ProjectFilters): Promise<PaginatedResult<Project>> {
    const search = filters.search?.toLowerCase();
    const filteredProjects = this.projects.filter((project) => {
      const matchesStatus = filters.status ? project.status === filters.status : true;
      const matchesSearch = search
        ? `${project.clientName} ${project.projectName} ${project.stack.join(' ')}`
            .toLowerCase()
            .includes(search)
        : true;

      return matchesStatus && matchesSearch;
    });
    const paginated = paginate(filteredProjects, filters.page, filters.size);

    return {
      data: paginated.data,
      paginationOptions: {
        page: filters.page,
        size: filters.size,
        totalPages: paginated.totalPages,
      },
    };
  }

  async getProjectById(projectId: string): Promise<Project | undefined> {
    return this.projects.find((project) => project.id === projectId);
  }

  async getAuditEvents(): Promise<AuditEvent[]> {
    return [...this.auditEvents].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt)
    );
  }

  async getHealth(): Promise<{status: string; databaseProvider: string; optimizedApi: boolean}> {
    return {
      status: 'ok',
      databaseProvider: 'memory',
      optimizedApi: true,
    };
  }
}
