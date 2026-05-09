import { ProjectStatus } from '@prisma/client';

export interface CreateProjectInput {
  name: string;
  description?: string;
  business_type_id: number;
  channel_partner_id?: number;
  total_amount?: number;
  advance_paid?: number;
  deadline?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  business_type_id?: number;
  channel_partner_id?: number;
  total_amount?: number;
  advance_paid?: number;
  deadline?: string;
  status?: ProjectStatus;
}

export interface ProjectQueryFilters {
  page?: string;
  limit?: string;
  search?: string;
  business_type_id?: number;
  channel_partner_id?: number;
  status?: ProjectStatus;
  created_by?: number;
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
