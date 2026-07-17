import type {PaginatedResult, Project, ProjectFilters, ProjectStatus} from '../types/domain';
import type {ProjectRepository} from '../providers/projectRepository';
import {NotFoundError} from '../utils/httpErrors';
import {getPaginationOptions} from '../utils/pagination';

const PROJECT_STATUSES = ['planning', 'active', 'review', 'completed'];

export class ProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async getProjects(query: Record<string, unknown>): Promise<PaginatedResult<Project>> {
    const pagination = getPaginationOptions(query);
    const status = parseProjectStatus(query.status);
    const search = query.search ? String(query.search).trim() : undefined;

    return this.repository.getProjects({
      status,
      search,
      page: pagination.page,
      size: pagination.size,
    });
  }

  async getProjectById(projectId: string): Promise<Project> {
    const project = await this.repository.getProjectById(projectId);

    if (!project) {
      throw new NotFoundError('Project was not found.');
    }

    return project;
  }
}

function parseProjectStatus(status: unknown): ProjectStatus | undefined {
  if (!status) {
    return undefined;
  }

  const value = String(status);
  return PROJECT_STATUSES.includes(value) ? (value as ProjectStatus) : undefined;
}
