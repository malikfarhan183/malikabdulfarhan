import {BadRequestError} from './httpErrors';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireString(value: unknown, fieldName: string): string {
  const text = String(value || '').trim();

  if (!text) {
    throw new BadRequestError(`${fieldName} is required.`);
  }

  return text;
}

export function requireEmail(value: unknown): string {
  const email = requireString(value, 'email').toLowerCase();

  if (!emailPattern.test(email)) {
    throw new BadRequestError('email must be a valid email address.');
  }

  return email;
}
