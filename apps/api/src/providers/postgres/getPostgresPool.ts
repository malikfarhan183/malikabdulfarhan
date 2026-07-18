export interface PostgresConfig {
  connectionString: string;
  ssl: boolean;
}

let cachedPool: any;

export async function getPostgresPool(config: PostgresConfig): Promise<any> {
  if (cachedPool) {
    return cachedPool;
  }

  const pg = await import('pg');
  cachedPool = new pg.Pool({
    connectionString: config.connectionString,
    ssl: config.ssl ? {rejectUnauthorized: false} : undefined,
  });

  return cachedPool;
}
