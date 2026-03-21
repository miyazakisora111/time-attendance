/**
 * Laravel APIが返す統一エラーレスポンス型。
 */
export type ApiError = {
    /** ヒューマンリーダブルなエラーメッセージ */
    message: string;
    /** マシンリーダブルなエラーコード */
    code: string;
    /** バリデーションエラーの詳細（フィールド名 → メッセージ配列） */
    errors?: Record<string, string[]>;
};

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

/**
 * AxiosError や catch された unknown から ApiError を安全に抽出する。
 *
 * @param error catch で受け取った値
 * @returns ApiError（抽出できない場合はデフォルト値）
 */
export const toApiError = (error: unknown): ApiError => {
    // error.response.data パターン（AxiosError）
    if (typeof error === 'object' && error !== null) {
        const axiosLike = error as Record<string, unknown>;
        if (typeof axiosLike.response === 'object' && axiosLike.response !== null) {
            const resp = axiosLike.response as Record<string, unknown>;
            if (isApiError(resp.data)) return resp.data;
        }
    }

    // 直接 ApiError が渡された場合
    if (isApiError(error)) return error;

    return {
        message: 'エラーが発生しました。',
        code: ApiErrorCode.Internal,
    };
};
