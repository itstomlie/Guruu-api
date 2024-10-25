import { HttpStatus } from '@nestjs/common';

import { BaseApiError } from './base-api-error';

export interface ApiResponse<T> {
  success: true;
  status: HttpStatus;
  data?: T;
}

export interface ErrorApiResponse {
  success: false;
  error: BaseApiError;
}

export interface PaginatedData<T> {
  currentPage: number;
  size: number;
  totalPages: number;
  totalItems: number;
  data: T[];
}
