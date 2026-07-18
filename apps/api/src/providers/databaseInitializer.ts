import {getMssqlConfigFromEnv} from './mssql/mssqlConfig';
import {initializeMssqlDatabase} from './mssql/mssqlInitializer';
import {getPostgresConfigFromEnv} from './postgres/postgresConfig';
import {initializePostgresDatabase} from './postgres/postgresInitializer';

export async function initializeDatabase(): Promise<void> {
  const shouldInitializeMssql =
    process.env.DATABASE_PROVIDER === 'mssql' && process.env.MSSQL_AUTO_MIGRATE === 'true';
  const shouldInitializePostgres =
    process.env.DATABASE_PROVIDER === 'postgres' && process.env.POSTGRES_AUTO_MIGRATE === 'true';

  if (shouldInitializeMssql) {
    await initializeMssqlDatabase(getMssqlConfigFromEnv());
  }

  if (shouldInitializePostgres) {
    await initializePostgresDatabase(getPostgresConfigFromEnv());
  }
}
