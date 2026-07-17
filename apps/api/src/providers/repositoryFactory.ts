import {InMemoryProjectRepository} from './inMemoryProjectRepository';
import {getMssqlConfigFromEnv} from './mssql/mssqlConfig';
import {MssqlProjectRepository} from './mssql/mssqlProjectRepository';
import type {ProjectRepository} from './projectRepository';

let repository: ProjectRepository;

export function getProjectRepository(): ProjectRepository {
  if (repository) {
    return repository;
  }

  repository =
    process.env.DATABASE_PROVIDER === 'mssql'
      ? new MssqlProjectRepository(getMssqlConfigFromEnv())
      : new InMemoryProjectRepository();

  return repository;
}
