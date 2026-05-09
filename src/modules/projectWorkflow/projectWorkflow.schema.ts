export const createProjectWorkflowSchema = {
  body: {
    oneOf: [
      {
        type: 'object',
        required: ['business_type_id', 'stage_id', 'sequence'],
        properties: {
          business_type_id: { type: 'integer' },
          stage_id: { type: 'integer' },
          sequence: { type: 'integer', minimum: 1 }
        }
      },
      {
        type: 'object',
        required: ['business_type_id', 'stages'],
        properties: {
          business_type_id: { type: 'integer' },
          stages: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['stage_id', 'sequence'],
              properties: {
                stage_id: { type: 'integer' },
                sequence: { type: 'integer', minimum: 1 }
              }
            }
          }
        }
      }
    ]
  }
};

export const updateProjectWorkflowSchema = {
  body: {
    type: 'object',
    properties: {
      stage_id: { type: 'integer' },
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
        id: { type: 'integer' },
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
      business_type_id: { type: 'integer' }
    }
  }
};

export const businessTypeParamsSchema = {
  params: {
    type: 'object',
    required: ['businessTypeId'],
    properties: {
      businessTypeId: { type: 'integer' }
    }
  }
};
