import type {NextFunction, Request, Response} from 'express';
import {HttpError} from '../utils/httpErrors';

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  const status = error instanceof HttpError ? error.status : 500;
  const message = error instanceof HttpError ? error.message : 'Unexpected server error.';

  response.status(status).json({
    success: false,
    message,
  });
}
