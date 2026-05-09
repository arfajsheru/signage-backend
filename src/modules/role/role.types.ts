export interface CreateRoleInput {
  name: string;
}

export interface UpdateRoleInput {
  name: string;
}

export interface RoleQueryFilters {
  search?: string;
  page?: string;
  limit?: string;
}
