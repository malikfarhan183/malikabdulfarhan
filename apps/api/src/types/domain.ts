export type UserRole = 'admin' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ProjectStatus = 'planning' | 'active' | 'review' | 'completed';

export interface Project {
  id: string;
  clientName: string;
  projectName: string;
  status: ProjectStatus;
  budget: number;
  healthScore: number;
  stack: string[];
  dueDate: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  projectId?: string;
  actor: string;
  action: string;
  message: string;
  createdAt: string;
}

export interface PaginationOptions {
  page: number;
  size: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  paginationOptions: PaginationOptions;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
  page: number;
  size: number;
}

export interface DashboardSummary {
  activeProjects: number;
  totalBudget: number;
  averageHealth: number;
  apiLatency: number;
}

export interface AuthSession {
  token: string;
  user: SafeUser;
}
