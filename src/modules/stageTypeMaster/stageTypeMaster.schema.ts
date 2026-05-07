export const createStageTypeSchema = {
  body: {
    type: 'object',
    required: ['stage_type', 'name'],
    properties: {
      stage_type: { type: 'integer' },
      name: { type: 'string', minLength: 2, maxLength: 50 }
    }
  }
};

export const updateStageTypeSchema = {
  body: {
    type: 'object',
    properties: {
      stage_type: { type: 'integer' },
      name: { type: 'string', minLength: 2, maxLength: 50 }
    }
  }
};

export const stageTypeQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string', default: '1' },
      limit: { type: 'string', default: '10' },
      search: { type: 'string' },
      sortBy: { type: 'string', enum: ['stage_type', 'created_at'] },
      sortOrder: { type: 'string', enum: ['asc', 'desc'] }
    }
  }
};
