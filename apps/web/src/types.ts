export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthSession {
  token: string;
  user: SafeUser;
}

export interface DashboardSummary {
  activeProjects: number;
  totalBudget: number;
  averageHealth: number;
  apiLatency: number;
}

export interface Project {
  id: string;
  clientName: string;
  projectName: string;
  status: 'planning' | 'active' | 'review' | 'completed';
  budget: number;
  healthScore: number;
  stack: string[];
  dueDate: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  message: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  paginationOptions: {
    page: number;
    size: number;
    totalPages: number;
  };
}
