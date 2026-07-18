import {createApp} from '../apps/api/src/app';
import {initializeDatabase} from '../apps/api/src/providers/databaseInitializer';

const app = createApp();
let initializationPromise: Promise<void> | undefined;

function ensureDatabaseInitialized(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = initializeDatabase();
  }

  return initializationPromise;
}

export default async function handler(request: any, response: any) {
  await ensureDatabaseInitialized();
  return app(request, response);
}
