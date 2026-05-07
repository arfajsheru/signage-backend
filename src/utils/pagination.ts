export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (query: any): PaginationParams => {
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '10', 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getMeta = (total: number, page: number, limit: number) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
