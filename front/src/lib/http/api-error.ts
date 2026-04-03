/**
 * Laravel APIが返す統一エラーHTTPレスポンス型。
 */
export type ApiError = {
    /** ヒューマンリーダブルなエラーメッセージ */
    message: string;
    /** マシンリーダブルなエラーコード */
    code: string;
    /** バリデーションエラーの詳細（フィールド名 → メッセージ配列） */
    errors?: Record<string, string[]>;
};

export class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message)
        this.name = 'UnauthorizedError'
    }
}

/**
 * APIエラーコード定数。
 *
 * Laravel Handler.php のエラーコードと一致させること。
 */
export const ApiErrorCode = {
    Validation: 'VALIDATION_ERROR',
    Auth: 'AUTH_ERROR',
    Forbidden: 'FORBIDDEN_ERROR',
    Domain: 'DOMAIN_ERROR',
    NotFound: 'NOT_FOUND',
    Internal: 'INTERNAL_ERROR',
} as const;

export type ApiErrorCodeValue = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

/**
 * unknown な値が ApiError 形状かどうかを判定する型ガード。
 */
export const isApiError = (value: unknown): value is ApiError => {
    if (typeof value !== 'object' || value === null) return false;
    const record = value as Record<string, unknown>;
    return typeof record.message === 'string' && typeof record.code === 'string';
};


