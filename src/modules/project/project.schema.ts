export const createProjectSchema = {
  body: {
    type: 'object',
    required: ['name', 'business_type_id'],
    properties: {
      project_code: { type: 'string' },
      name: { type: 'string', minLength: 3, maxLength: 100 },
      project_source: { type: 'string', enum: ['DIRECT', 'CHANNEL_PARTNER'] },
      client_name: { type: 'string' },
      client_phone: { type: 'string' },
      client_email: {
        anyOf: [
          { type: 'string', format: 'email' },
          { type: 'string', maxLength: 0 }
        ]
      },
      site_address: { type: 'string' },
      site_map_link: { type: 'string' },
      project_category_id: { type: 'integer' },
      notes: { type: 'string' },
      priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
      business_type_id: { type: 'integer' },
      channel_partner_id: { type: 'integer' },
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
      project_code: { type: 'string' },
      name: { type: 'string', minLength: 3, maxLength: 100 },
      project_source: { type: 'string', enum: ['DIRECT', 'CHANNEL_PARTNER'] },
      client_name: { type: 'string' },
      client_phone: { type: 'string' },
      client_email: {
        anyOf: [
          { type: 'string', format: 'email' },
          { type: 'string', maxLength: 0 }
        ]
      },
      site_address: { type: 'string' },
      site_map_link: { type: 'string' },
      project_category_id: { type: 'integer' },
      notes: { type: 'string' },
      priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
      business_type_id: { type: 'integer' },
      channel_partner_id: { type: 'integer' },
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
      project_source: { type: 'string', enum: ['DIRECT', 'CHANNEL_PARTNER'] },
      business_type_id: { type: 'integer' },
      channel_partner_id: { type: 'integer' },
      project_category_id: { type: 'integer' },
      priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
      status: { type: 'string', enum: ['CREATED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD'] },
      created_by: { type: 'integer' },
      sortBy: { type: 'string' },
      sortOrder: { type: 'string', enum: ['asc', 'desc'] }
    }
  }
};

const projectCategoryObject = {
  type: 'object',
  required: ['business_type_id', 'category_name'],
  properties: {
    business_type_id: { type: 'integer' },
    category_name: { type: 'string', minLength: 1, maxLength: 255 }
  }
};

export const createProjectCategorySchema = {
  body: {
    anyOf: [
      projectCategoryObject,
      {
        type: 'array',
        items: projectCategoryObject,
        minItems: 1
      }
    ]
  }
};

export const projectCategoryQuerySchema = {
  params: {
    type: 'object',
    required: ['business_type_id'],
    properties: {
      business_type_id: { type: 'integer' }
    }
  },
  querystring: {
    type: 'object',
    properties: {
      search: { type: 'string' }
    }
  }
};
