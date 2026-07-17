import {InMemoryProjectRepository} from './inMemoryProjectRepository';
import {MssqlProjectRepository} from './mssql/mssqlProjectRepository';
import type {ProjectRepository} from './projectRepository';

let repository: ProjectRepository;

export function getProjectRepository(): ProjectRepository {
  if (repository) {
    return repository;
  }

  repository =
    process.env.DATABASE_PROVIDER === 'mssql'
      ? new MssqlProjectRepository({
          server: process.env.MSSQL_SERVER || 'localhost',
          port: Number(process.env.MSSQL_PORT || 1433),
          database: process.env.MSSQL_DATABASE || 'ClientOpsStudio',
          user: process.env.MSSQL_USER || 'sa',
          password: process.env.MSSQL_PASSWORD || '',
          encrypt: process.env.MSSQL_ENCRYPT === 'true',
        })
      : new InMemoryProjectRepository();

  return repository;
}
