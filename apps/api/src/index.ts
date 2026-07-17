import {createApp} from './app';
import {initializeDatabase} from './providers/databaseInitializer';

const port = Number(process.env.PORT || 4200);

async function start(): Promise<void> {
  await initializeDatabase();

  const app = createApp();

  app.listen(port, () => {
    console.log(`ClientOps Studio running at http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('ClientOps Studio failed to start.', error);
  process.exit(1);
});
