export interface CreateUserInput {
  vendor_id: number;
  role_id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  is_active?: boolean;
}

export interface LoginInput {
  identifier: string; // Can be email or phone
  password: string;
}

export interface UserQueryFilters {
  page?: string;
  limit?: string;
  search?: string;
  vendor_id?: number;
  role_id?: number;
}
