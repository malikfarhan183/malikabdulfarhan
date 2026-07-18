import {Router} from 'express';
import * as authController from '../controllers/authController';
import * as dashboardController from '../controllers/dashboardController';
import * as projectController from '../controllers/projectController';
import * as systemController from '../controllers/systemController';
import {authenticate} from '../middleware/authenticate';
import {handleRequest} from '../utils/handleRequest';

export function getApiRouter(): Router {
  const router = Router();

  router.post('/auth/login', handleRequest(authController.login));
  router.get('/system/health', handleRequest(systemController.getHealth));
  router.get('/auth/me', authenticate, handleRequest(authController.getMe));
  router.get('/dashboard/summary', authenticate, handleRequest(dashboardController.getDashboardSummary));
  router.get('/projects', authenticate, handleRequest(projectController.getProjects));
  router.get('/projects/:projectId', authenticate, handleRequest(projectController.getProjectById));
  router.get('/audit-events', authenticate, handleRequest(projectController.getAuditEvents));

  return router;
}
