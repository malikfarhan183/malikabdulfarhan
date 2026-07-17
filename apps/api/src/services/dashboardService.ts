import type {DashboardSummary} from '../types/domain';
import type {ProjectRepository} from '../providers/projectRepository';

export class DashboardService {
  constructor(private readonly repository: ProjectRepository) {}

  async getSummary(): Promise<DashboardSummary> {
    return this.repository.getDashboardSummary();
  }
}
