import {getMssqlConfigFromEnv} from './mssql/mssqlConfig';
import {initializeMssqlDatabase} from './mssql/mssqlInitializer';

export async function initializeDatabase(): Promise<void> {
  const shouldInitializeMssql =
    process.env.DATABASE_PROVIDER === 'mssql' && process.env.MSSQL_AUTO_MIGRATE === 'true';

  if (shouldInitializeMssql) {
    await initializeMssqlDatabase(getMssqlConfigFromEnv());
  }
}
