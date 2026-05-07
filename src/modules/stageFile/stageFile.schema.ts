export const updateStageFileSchema = {
  body: {
    type: 'object',
    required: ['document_type_id'],
    properties: {
      document_type_id: { type: 'string', format: 'uuid' }
    }
  }
};

export const stageFileQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string', default: '1' },
      limit: { type: 'string', default: '10' },
      project_stage_id: { type: 'string', format: 'uuid' },
      document_type_id: { type: 'string', format: 'uuid' },
      uploaded_by: { type: 'string', format: 'uuid' },
      search: { type: 'string' }
    }
  }
};
