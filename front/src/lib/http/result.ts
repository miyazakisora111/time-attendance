import type { AxiosResponse } from 'axios';

/* ============================
 * Envelope 定義/判定/unwrap
 * ============================ */
export type ApiEnvelope<T> = {
    success: boolean;
    message: string;
    data: T;
    meta?: unknown;
};

type ApiPayload<T> = T | ApiEnvelope<T> | AxiosResponse<unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null;
};

const hasOwnKey = <TKey extends string>(
    value: Record<string, unknown>,
    key: TKey,
): value is Record<TKey, unknown> & Record<string, unknown> => {
    return Object.prototype.hasOwnProperty.call(value, key);
};

const isAxiosResponse = (value: unknown): value is AxiosResponse<unknown> => {
    if (!isRecord(value)) return false;

    return (
        hasOwnKey(value, 'status') &&
        hasOwnKey(value, 'headers') &&
        hasOwnKey(value, 'data')
    );
};

export const isApiEnvelope = <T = unknown>(payload: unknown): payload is ApiEnvelope<T> => {
    if (!isRecord(payload)) return false;
    if (isAxiosResponse(payload)) return false; // AxiosResponse は除外

    const hasKeys =
        hasOwnKey(payload, 'data') &&
        hasOwnKey(payload, 'success') &&
        hasOwnKey(payload, 'message');

    const typeSafe =
        typeof payload.success === 'boolean' &&
        typeof payload.message === 'string';

    return !!hasKeys && !!typeSafe;
};

/**
 * Envelope を剥がして T を返す
 * - AxiosResponse の場合は res.data を対象にする
 * - Envelope でなければそのまま T として返す（寛容）
 */
export const unwrapApiEnvelope = <T>(payload: ApiPayload<T>): T => {
    const base: unknown = isAxiosResponse(payload) ? payload.data : payload;
    return isApiEnvelope<T>(base) ? base.data : (base as T);
};

/* ============================
 * call（遅延実行で包む）
 * ============================ */
type AsyncFn<T> = () => Promise<T>;

/**
 * call:
 * - 関数を受けて実行
 * - Envelope を unwrap して T を返す（throw 版）
 *   -> React Query の queryFn 向け
 */
export const call = async <T>(fn: AsyncFn<T>): Promise<T> => {
    const res = await fn();
    return unwrapApiEnvelope<T>(res as ApiPayload<T>);
};