import type {Request, Response, NextFunction} from 'express';

type Handler<T> = (request: Request) => Promise<T> | T;

export function handleRequest<T>(handler: Handler<T>, status = 200) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const result = await handler(request);
      response.status(status).json(result);
    } catch (error) {
      next(error);
    }
  };
}
