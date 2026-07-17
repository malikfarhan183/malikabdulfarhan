export interface MssqlConfig {
  server: string;
  port: number;
  database: string;
  user: string;
  password: string;
  encrypt: boolean;
}

let cachedPool: unknown;

export async function getMssqlPool(config: MssqlConfig): Promise<any> {
  if (cachedPool) {
    return cachedPool;
  }

  const sql = await import('mssql');
  cachedPool = await sql.connect({
    server: config.server,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    options: {
      encrypt: config.encrypt,
      trustServerCertificate: !config.encrypt,
    },
  });

  return cachedPool;
}
