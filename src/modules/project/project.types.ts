import { ProjectStatus } from '@prisma/client';

export interface CreateProjectInput {
  project_type_id: string;
  name: string;
  description?: string;
  total_amount?: number;
  advance_paid?: number;
  deadline?: string;
}

export interface UpdateProjectInput {
  project_type_id?: string;
  name?: string;
  description?: string;
  total_amount?: number;
  advance_paid?: number;
  status?: ProjectStatus;
  deadline?: string;
}

export interface ProjectQueryFilters {
  page?: string;
  limit?: string;
  search?: string;
  status?: ProjectStatus;
  project_type_id?: string;
}
