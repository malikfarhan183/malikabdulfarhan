declare module 'pg' {
  export class Pool {
    constructor(config: Record<string, unknown>);
    query(text: string, values?: unknown[]): Promise<{rows: any[]}>;
  }
}
