import type {NextFunction, Request, Response} from 'express';
import {getProjectRepository} from '../providers/repositoryFactory';
import {AuthService} from '../services/authService';
import {UnauthorizedError} from '../utils/httpErrors';
import {verifyJwt} from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        role: string;
      };
    }
  }
}

export async function authenticate(request: Request, _response: Response, next: NextFunction) {
  try {
    const token = getBearerToken(request);
    const payload = verifyJwt(token, getJwtSecret());
    const authService = new AuthService(getProjectRepository(), getJwtSecret());
    await authService.getCurrentUser(payload.sub);

    request.authUser = {
      id: payload.sub,
      role: payload.role,
    };
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuthenticatedUser(request: Request): string {
  if (!request.authUser?.id) {
    throw new UnauthorizedError();
  }

  return request.authUser.id;
}

function getBearerToken(request: Request): string {
  const header = request.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing bearer token.');
  }

  return header.slice(7);
}

function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'local-demo-secret';
}
