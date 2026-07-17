import crypto from 'node:crypto';
import {UnauthorizedError} from './httpErrors';

export interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

const DEFAULT_EXPIRES_IN_SECONDS = 3600;

export function signJwt(
  payload: Omit<JwtPayload, 'exp'>,
  secret: string,
  expiresInSeconds = DEFAULT_EXPIRES_IN_SECONDS
): string {
  const header = base64UrlEncode({alg: 'HS256', typ: 'JWT'});
  const body = base64UrlEncode({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });
  const signature = createSignature(`${header}.${body}`, secret);

  return `${header}.${body}.${signature}`;
}

export function verifyJwt(token: string, secret: string): JwtPayload {
  const [header, body, signature] = token.split('.');
  const hasRequiredParts = Boolean(header && body && signature);

  if (!hasRequiredParts) {
    throw new UnauthorizedError('Invalid token.');
  }

  const expectedSignature = createSignature(`${header}.${body}`, secret);

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new UnauthorizedError('Invalid token signature.');
  }

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as JwtPayload;
  const isExpired = payload.exp <= Math.floor(Date.now() / 1000);

  if (isExpired) {
    throw new UnauthorizedError('Token has expired.');
  }

  return payload;
}

function createSignature(value: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function base64UrlEncode(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}
