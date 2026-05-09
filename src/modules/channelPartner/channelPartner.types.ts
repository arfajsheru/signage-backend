

export interface CreateChannelPartnerInput {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  gst_number?: string;
  opening_balance?: number;
  credit_limit?: number;
  payment_due_days?: number;
  notes?: string;
}

export interface UpdateChannelPartnerInput extends Partial<CreateChannelPartnerInput> {
  is_active?: boolean;
}

export interface ChannelPartnerQueryFilters {
  page?: string;
  limit?: string;
  search?: string;
  is_active?: boolean;
}
