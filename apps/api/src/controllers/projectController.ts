import type {Request} from 'express';
import {getProjectRepository} from '../providers/repositoryFactory';
import {AuditService} from '../services/auditService';
import {ProjectService} from '../services/projectService';

const getProjectService = () => new ProjectService(getProjectRepository());

export async function getProjects(request: Request) {
  return getProjectService().getProjects(request.query);
}

export async function getProjectById(request: Request) {
  return {
    data: await getProjectService().getProjectById(request.params.projectId),
  };
}

export async function getAuditEvents() {
  const service = new AuditService(getProjectRepository());

  return {
    data: await service.getAuditEvents(),
  };
}
