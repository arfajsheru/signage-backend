export interface CreateProjectWorkflowInput {
  business_type_id: number;
  stage_id: number;
  sequence: number;
}

export interface BulkCreateProjectWorkflowInput {
  business_type_id: number;
  stages: {
    stage_id: number;
    sequence: number;
  }[];
}

export interface UpdateProjectWorkflowInput {
  stage_id?: number;
  sequence?: number;
}

export interface ReorderWorkflowItem {
  id: number;
  sequence: number;
}

export interface ProjectWorkflowQueryFilters {
  page?: string;
  limit?: string;
  business_type_id?: number;
}
