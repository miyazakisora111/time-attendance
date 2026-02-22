export interface ApiSuccess<T> {
    success: true
    data: T
    message?: string
    meta?: Record<string, unknown>
}

export interface ApiFailure {
    success: false
    message: string
    errors?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure
