import crypto from 'node:crypto';
import type {AuditEvent, Project, User} from '../types/domain';

export const DEMO_PASSWORD = 'Portfolio@2026';
export const DEMO_PASSWORD_HASH = crypto
  .createHash('sha256')
  .update(DEMO_PASSWORD)
  .digest('hex');

export const DEMO_USERS: User[] = [
  {
    id: '8e6b0769-b112-4c8d-a823-9a1329ac1231',
    name: 'Malik Farhan',
    email: 'malik@example.com',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'admin',
  },
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: '3caac240-f8e9-42ca-98e1-fdc4db739684',
    clientName: 'Acme Health',
    projectName: 'Patient Intake Dashboard',
    status: 'active',
    budget: 8500,
    healthScore: 94,
    stack: ['React', 'MUI', 'Node', 'Express', 'MSSQL'],
    dueDate: '2026-08-15',
    updatedAt: '2026-07-15T12:30:00.000Z',
  },
  {
    id: 'f4d5cd85-63bb-42c7-ad41-94d7fd54243e',
    clientName: 'Northwind Ops',
    projectName: 'API Performance Sprint',
    status: 'review',
    budget: 4200,
    healthScore: 88,
    stack: ['Node', 'Express', 'MSSQL', 'JWT'],
    dueDate: '2026-07-28',
    updatedAt: '2026-07-16T09:45:00.000Z',
  },
  {
    id: 'af85895f-2388-4010-a875-4beff0ef1195',
    clientName: 'BrightRetail',
    projectName: 'Admin Portal Rebuild',
    status: 'planning',
    budget: 6200,
    healthScore: 81,
    stack: ['React', 'Tailwind', 'MUI', 'REST'],
    dueDate: '2026-09-04',
    updatedAt: '2026-07-13T16:10:00.000Z',
  },
  {
    id: '5d89f71a-34d3-4a3d-a2c2-9785d292a930',
    clientName: 'Nimbus Finance',
    projectName: 'Secure Client Portal',
    status: 'completed',
    budget: 11200,
    healthScore: 97,
    stack: ['React', 'JWT', 'Node', 'SQL'],
    dueDate: '2026-06-21',
    updatedAt: '2026-06-21T11:00:00.000Z',
  },
];

export const DEMO_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'evt-auth-ready',
    actor: 'Malik Farhan',
    action: 'AUTH_READY',
    message: 'JWT login, protected routes, and session hydration are configured.',
    createdAt: '2026-07-16T10:15:00.000Z',
  },
  {
    id: 'evt-index-ready',
    actor: 'System',
    action: 'INDEX_READY',
    message: 'Project status and due-date indexes support optimized list queries.',
    createdAt: '2026-07-16T10:35:00.000Z',
  },
  {
    id: 'evt-api-ready',
    actor: 'System',
    action: 'API_READY',
    message: 'Dashboard, project, audit, and health endpoints are available.',
    createdAt: '2026-07-16T10:50:00.000Z',
  },
];
