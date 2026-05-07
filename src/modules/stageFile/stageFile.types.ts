export interface StageFileQueryFilters {
  page?: string;
  limit?: string;
  project_stage_id?: string;
  document_type_id?: string;
  uploaded_by?: string;
  search?: string;
}

export interface StageFileStats {
  total_uploads: number;
  by_document_type: { document_type: string; count: number }[];
  by_stage: { stage_name: string; count: number }[];
  by_user: { user_name: string; count: number }[];
}
