export interface CreateStageTypeInput {
  stage_type: number;
  name: string;
}

export interface UpdateStageTypeInput {
  stage_type?: number;
  name?: string;
}

export interface StageTypeQueryFilters {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
