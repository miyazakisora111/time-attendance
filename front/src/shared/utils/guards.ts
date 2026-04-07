/** unknown を Record として扱えるか判定 */
export const isRecord = (
    value: unknown
): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

/** 空でない string かどうか判定 */
export const isNonEmptyString = (
    value: unknown
): value is string =>
    typeof value === 'string' && value.trim().length > 0;