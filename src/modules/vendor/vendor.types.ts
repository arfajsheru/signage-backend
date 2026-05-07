export interface CreateVendorInput {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  gst_number?: string;
  pan_number?: string;
  opening_balance?: number;
}

export interface UpdateVendorInput {
  name?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  gst_number?: string;
  pan_number?: string;
  opening_balance?: number;
  is_active?: boolean;
}

export interface VendorQueryFilters {
  page?: string;
  limit?: string;
  search?: string;
}
