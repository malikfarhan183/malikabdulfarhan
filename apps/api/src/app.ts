import express from 'express';
import path from 'node:path';
import {getApiRouter} from './routes';
import {errorHandler} from './middleware/errorHandler';

export function createApp() {
  const app = express();
  const publicDir = path.resolve(__dirname, '..', 'public');

  app.disable('x-powered-by');
  app.use(express.json({limit: '64kb'}));
  app.use('/api', getApiRouter());
  app.use(express.static(publicDir));
  app.get('*', (_request, response) => {
    response.sendFile(path.join(publicDir, 'index.html'));
  });
  app.use(errorHandler);

  return app;
}
