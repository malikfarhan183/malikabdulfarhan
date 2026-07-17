import type {Request} from 'express';
import {getProjectRepository} from '../providers/repositoryFactory';
import {AuthService} from '../services/authService';
import {requireAuthenticatedUser} from '../middleware/authenticate';

const getAuthService = () =>
  new AuthService(getProjectRepository(), process.env.JWT_SECRET || 'local-demo-secret');

export async function login(request: Request) {
  const session = await getAuthService().login(request.body);

  return {
    data: session,
  };
}

export async function getMe(request: Request) {
  const userId = requireAuthenticatedUser(request);
  const user = await getAuthService().getCurrentUser(userId);

  return {
    data: user,
  };
}
