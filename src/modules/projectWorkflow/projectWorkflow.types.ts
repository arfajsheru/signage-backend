export interface CreateProjectWorkflowInput {
  business_type_id: string;
  stage_id: string;
  sequence: number;
}

export interface UpdateProjectWorkflowInput {
  stage_id?: string;
  sequence?: number;
}

export interface ReorderWorkflowItem {
  id: string;
  sequence: number;
}

export interface ProjectWorkflowQueryFilters {
  page?: string;
  limit?: string;
  business_type_id?: string;
}
