/**
 * HTTP レスポンス共通型定義
 */

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
}

export type Result<T, E = AppError> =
  | { ok: true; data: T }
  | { ok: false; error: E };