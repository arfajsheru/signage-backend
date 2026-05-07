export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: any;
}

export const successResponse = <T>(data: T, message: string = 'Success', meta?: any): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    meta,
  };
};

export const errorResponse = (message: string, error?: any): ApiResponse => {
  return {
    success: false,
    message,
    error,
  };
};
