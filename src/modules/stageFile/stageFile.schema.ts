export const updateStageFileSchema = {
  body: {
    type: 'object',
    required: ['document_type_id'],
    properties: {
      document_type_id: { type: 'integer' }
    }
  }
};

export const stageFileQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string', default: '1' },
      limit: { type: 'string', default: '10' },
      project_stage_id: { type: 'integer' },
      document_type_id: { type: 'integer' },
      uploaded_by: { type: 'integer' },
      search: { type: 'string' }
    }
  }
};

export const projectStageParamsSchema = {
  params: {
    type: 'object',
    required: ['projectStageId'],
    properties: {
      projectStageId: { type: 'integer' }
    }
  }
};
