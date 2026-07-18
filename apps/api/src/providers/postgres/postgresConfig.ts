import type {PostgresConfig} from './getPostgresPool';

export function getPostgresConfigFromEnv(): PostgresConfig {
  return {
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/clientopsstudio',
    ssl: process.env.POSTGRES_SSL !== 'false',
  };
}
