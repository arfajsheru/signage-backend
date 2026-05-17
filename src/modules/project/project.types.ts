import { ProjectStatus, ProjectPriority, ProjectSource } from '@prisma/client';

export interface CreateProjectInput {
  project_code?: string;
  name: string;
  project_source?: ProjectSource;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  site_address?: string;
  site_map_link?: string;
  project_category_id?: number;
  notes?: string;
  priority?: ProjectPriority;
  business_type_id: number;
  channel_partner_id?: number;
  total_amount?: number;
  advance_paid?: number;
  deadline?: string;
}

export interface UpdateProjectInput {
  project_code?: string;
  name?: string;
  project_source?: ProjectSource;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  site_address?: string;
  site_map_link?: string;
  project_category_id?: number;
  notes?: string;
  priority?: ProjectPriority;
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
  project_source?: ProjectSource;
  business_type_id?: number;
  channel_partner_id?: number;
  project_category_id?: number;
  priority?: ProjectPriority;
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
