export const createDocumentTypeSchema = {
  body: {
    type: 'object',
    required: ['document_type', 'name'],
    properties: {
      document_type: { type: 'integer' },
      name: { type: 'string', minLength: 2, maxLength: 50 }
    }
  }
};

export const updateDocumentTypeSchema = {
  body: {
    type: 'object',
    properties: {
      document_type: { type: 'integer' },
      name: { type: 'string', minLength: 2, maxLength: 50 }
    }
  }
};

export const documentTypeQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string', default: '1' },
      limit: { type: 'string', default: '10' },
      search: { type: 'string' },
      sortBy: { type: 'string', enum: ['document_type', 'created_at'] },
      sortOrder: { type: 'string', enum: ['asc', 'desc'] }
    }
  }
};
