import { ProjectStatus } from '@prisma/client';

export interface CreateProjectInput {
  name: string;
  description?: string;
  business_type_id: string;
  channel_partner_id?: string;
  total_amount?: number;
  advance_paid?: number;
  deadline?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  business_type_id?: string;
  channel_partner_id?: string;
  total_amount?: number;
  advance_paid?: number;
  deadline?: string;
  status?: ProjectStatus;
}

export interface ProjectQueryFilters {
  page?: string;
  limit?: string;
  search?: string;
  business_type_id?: string;
  channel_partner_id?: string;
  status?: ProjectStatus;
  created_by?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  delayed: number;
  signage: number;
  print: number;
}
