export const createVendorSchema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 1 },
      contact_person: { type: 'string' },
      phone: { type: 'string', minLength: 10 },
      email: { type: 'string', format: 'email' },
      address: { type: 'string' },
      gst_number: { type: 'string' },
      pan_number: { type: 'string' },
      opening_balance: { type: 'number', minimum: 0, default: 0 }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'object', additionalProperties: true }
      }
    }
  }
};

export const updateVendorSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      contact_person: { type: 'string' },
      phone: { type: 'string', minLength: 10 },
      email: { type: 'string', format: 'email' },
      address: { type: 'string' },
      gst_number: { type: 'string' },
      pan_number: { type: 'string' },
      opening_balance: { type: 'number', minimum: 0 },
      is_active: { type: 'boolean' }
    }
  }
};

export const querySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string', default: '1' },
      limit: { type: 'string', default: '10' },
      search: { type: 'string' }
    }
  }
};
