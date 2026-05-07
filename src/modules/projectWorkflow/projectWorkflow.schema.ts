export const createProjectWorkflowSchema = {
  body: {
    type: 'object',
    required: ['business_type_id', 'stage_id', 'sequence'],
    properties: {
      business_type_id: { type: 'string', format: 'uuid' },
      stage_id: { type: 'string', format: 'uuid' },
      sequence: { type: 'integer', minimum: 1 }
    }
  }
};

export const updateProjectWorkflowSchema = {
  body: {
    type: 'object',
    properties: {
      stage_id: { type: 'string', format: 'uuid' },
      sequence: { type: 'integer', minimum: 1 }
    }
  }
};

export const reorderWorkflowSchema = {
  body: {
    type: 'array',
    minItems: 1,
    items: {
      type: 'object',
      required: ['id', 'sequence'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        sequence: { type: 'integer', minimum: 1 }
      }
    }
  }
};

export const projectWorkflowQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string', default: '1' },
      limit: { type: 'string', default: '10' },
      business_type_id: { type: 'string', format: 'uuid' }
    }
  }
};

export const businessTypeParamsSchema = {
  params: {
    type: 'object',
    required: ['businessTypeId'],
    properties: {
      businessTypeId: { type: 'string', format: 'uuid' }
    }
  }
};
