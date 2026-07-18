import {InMemoryProjectRepository} from './inMemoryProjectRepository';
import {getMssqlConfigFromEnv} from './mssql/mssqlConfig';
import {MssqlProjectRepository} from './mssql/mssqlProjectRepository';
import {getPostgresConfigFromEnv} from './postgres/postgresConfig';
import {PostgresProjectRepository} from './postgres/postgresProjectRepository';
import type {ProjectRepository} from './projectRepository';

let repository: ProjectRepository;

export function getProjectRepository(): ProjectRepository {
  if (repository) {
    return repository;
  }

  if (process.env.DATABASE_PROVIDER === 'mssql') {
    repository = new MssqlProjectRepository(getMssqlConfigFromEnv());
  } else if (process.env.DATABASE_PROVIDER === 'postgres') {
    repository = new PostgresProjectRepository(getPostgresConfigFromEnv());
  } else {
    repository = new InMemoryProjectRepository();
  }

  return repository;
}
