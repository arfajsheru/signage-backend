import { ApprovalStatus } from '@prisma/client';

export interface CreateStageApprovalInput {
  project_stage_id: string;
  approval_status: ApprovalStatus;
  remarks?: string;
}

export interface UpdateStageApprovalInput {
  approval_status?: ApprovalStatus;
  remarks?: string;
}

export interface StageApprovalQueryFilters {
  page?: string;
  limit?: string;
  project_stage_id?: string;
  approval_status?: ApprovalStatus;
  approved_by?: string;
}

export interface StageApprovalStats {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}
