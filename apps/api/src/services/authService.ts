import crypto from 'node:crypto';
import type {AuthSession, SafeUser} from '../types/domain';
import {UnauthorizedError} from '../utils/httpErrors';
import {signJwt} from '../utils/jwt';
import {requireEmail, requireString} from '../utils/validators';
import type {ProjectRepository} from '../providers/projectRepository';

export interface LoginPayload {
  email: unknown;
  password: unknown;
}

export class AuthService {
  constructor(
    private readonly repository: ProjectRepository,
    private readonly jwtSecret: string
  ) {}

  async login(payload: LoginPayload): Promise<AuthSession> {
    const email = requireEmail(payload.email);
    const password = requireString(payload.password, 'password');
    const user = await this.repository.getUserByEmail(email);
    const isValidPassword = user
      ? hashPassword(password) === user.passwordHash
      : false;

    if (!user || !isValidPassword) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    return {
      token: signJwt({sub: user.id, role: user.role}, this.jwtSecret, getTokenLifetime()),
      user: toSafeUser(user),
    };
  }

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await this.repository.getUserById(userId);

    if (!user) {
      throw new UnauthorizedError();
    }

    return toSafeUser(user);
  }
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function getTokenLifetime(): number {
  return Number(process.env.JWT_EXPIRES_IN_SECONDS || 3600);
}

function toSafeUser(user: {id: string; name: string; email: string; role: SafeUser['role']}): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
