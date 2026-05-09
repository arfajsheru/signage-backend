export const createUserSchema = {
  body: {
    type: 'object',
    required: ['vendor_id', 'role_id', 'name', 'email', 'password'],
    properties: {
      vendor_id: { type: 'string', format: 'uuid' },
      role_id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      phone: { type: 'string' }
    }
  }
};

export const loginSchema = {
  body: {
    type: 'object',
    required: ['identifier', 'password'],
    properties: {
      identifier: { type: 'string', minLength: 3 },
      password: { type: 'string' }
    }
  }
};

export const updateUserSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      phone: { type: 'string' },
      is_active: { type: 'boolean' }
    }
  }
};

export const userQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string', default: '1' },
      limit: { type: 'string', default: '10' },
      search: { type: 'string' },
      vendor_id: { type: 'string' },
      role_id: { type: 'string' }
    }
  }
};
