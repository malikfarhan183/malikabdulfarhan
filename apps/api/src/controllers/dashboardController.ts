import {getProjectRepository} from '../providers/repositoryFactory';
import {DashboardService} from '../services/dashboardService';

export async function getDashboardSummary() {
  const service = new DashboardService(getProjectRepository());

  return {
    data: await service.getSummary(),
  };
}
