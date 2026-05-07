export interface CreateDocumentTypeInput {
  document_type: number;
  name: string;
}

export interface UpdateDocumentTypeInput {
  document_type?: number;
  name?: string;
}

export interface DocumentTypeQueryFilters {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
