import { ApprovalStatus } from '@prisma/client';

export const createStageApprovalSchema = {
  body: {
    type: 'object',
    required: ['project_stage_id', 'approval_status'],
    properties: {
      project_stage_id: { type: 'string', format: 'uuid' },
      approval_status: { type: 'string', enum: Object.values(ApprovalStatus) },
      remarks: { type: 'string' }
    }
  }
};

export const updateStageApprovalSchema = {
  body: {
    type: 'object',
    properties: {
      approval_status: { type: 'string', enum: Object.values(ApprovalStatus) },
      remarks: { type: 'string' }
    }
  }
};

export const rejectStageApprovalSchema = {
  body: {
    type: 'object',
    required: ['remarks'],
    properties: {
      remarks: { type: 'string', minLength: 1 }
    }
  }
};

export const stageApprovalQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string', default: '1' },
      limit: { type: 'string', default: '10' },
      project_stage_id: { type: 'string', format: 'uuid' },
      approval_status: { type: 'string', enum: Object.values(ApprovalStatus) },
      approved_by: { type: 'string', format: 'uuid' }
    }
  }
};
