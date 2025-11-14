// API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error response
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// Upload response
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}