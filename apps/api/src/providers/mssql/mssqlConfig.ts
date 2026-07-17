import type {MssqlConfig} from './getMssqlPool';

export function getMssqlConfigFromEnv(): MssqlConfig {
  return {
    server: process.env.MSSQL_SERVER || 'localhost',
    port: Number(process.env.MSSQL_PORT || 1433),
    database: process.env.MSSQL_DATABASE || 'ClientOpsStudio',
    user: process.env.MSSQL_USER || 'sa',
    password: process.env.MSSQL_PASSWORD || '',
    encrypt: process.env.MSSQL_ENCRYPT === 'true',
  };
}
