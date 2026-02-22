export class AppError extends Error {
  public code: string;
  public statusCode: number;

  constructor(
    message: string,
    code: string = 'APP_ERROR',
    statusCode: number = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;

    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ApiError extends AppError {
  public validationErrors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    validationErrors?: Record<string, string[]>
  ) {
    super(message, `API_ERROR_${statusCode}`, statusCode);
    this.validationErrors = validationErrors;
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  isValidationError(): boolean {
    return !!this.validationErrors && Object.keys(this.validationErrors).length > 0;
  }

  getFieldErrors(): Record<string, string[]> {
    return this.validationErrors || {};
  }
}

export class AuthError extends AppError {
  constructor(message: string = '認証に失敗しました') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = '認可が必要です') {
    super(message, 'UNAUTHORIZED_ERROR', 403);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'リソースが見つかりません') {
    super(message, 'NOT_FOUND_ERROR', 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'ネットワークエラーが発生しました') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * エラーオブジェクトの型判定
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}
