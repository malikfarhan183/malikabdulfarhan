import type {AuditEvent} from '../types/domain';
import type {ProjectRepository} from '../providers/projectRepository';

export class AuditService {
  constructor(private readonly repository: ProjectRepository) {}

  async getAuditEvents(): Promise<AuditEvent[]> {
    return this.repository.getAuditEvents();
  }
}
