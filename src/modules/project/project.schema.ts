export const createProjectSchema = {
  body: {
    type: 'object',
    required: ['name', 'business_type_id'],
    properties: {
      name: { type: 'string', minLength: 3, maxLength: 100 },
      description: { type: 'string' },
      business_type_id: { type: 'string', format: 'uuid' },
      channel_partner_id: { type: 'string', format: 'uuid' },
      total_amount: { type: 'number', minimum: 0 },
      advance_paid: { type: 'number', minimum: 0 },
      deadline: { type: 'string', format: 'date-time' }
    }
  }
};

export const updateProjectSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 3, maxLength: 100 },
      description: { type: 'string' },
      business_type_id: { type: 'string', format: 'uuid' },
      channel_partner_id: { type: 'string', format: 'uuid' },
      total_amount: { type: 'number', minimum: 0 },
      advance_paid: { type: 'number', minimum: 0 },
      deadline: { type: 'string', format: 'date-time' },
      status: { type: 'string', enum: ['CREATED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD'] }
    }
  }
};

export const updateProjectStatusSchema = {
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['CREATED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD'] }
    }
  }
};

export const projectQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string', default: '1' },
      limit: { type: 'string', default: '10' },
      search: { type: 'string' },
      business_type_id: { type: 'string', format: 'uuid' },
      channel_partner_id: { type: 'string', format: 'uuid' },
      status: { type: 'string', enum: ['CREATED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD'] },
      created_by: { type: 'string', format: 'uuid' },
      sortBy: { type: 'string' },
      sortOrder: { type: 'string', enum: ['asc', 'desc'] }
    }
  }
};
