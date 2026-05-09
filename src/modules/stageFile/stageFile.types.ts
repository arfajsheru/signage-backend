export interface StageFileQueryFilters {
  page?: string;
  limit?: string;
  project_stage_id?: number;
  document_type_id?: number;
  uploaded_by?: number;
  search?: string;
}

export interface StageFileStats {
  total_uploads: number;
  by_document_type: { document_type: string; count: number }[];
  by_stage: { stage_name: string; count: number }[];
  by_user: { user_name: string; count: number }[];
}
