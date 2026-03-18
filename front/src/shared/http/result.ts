import type { AxiosResponse } from 'axios';

/* ============================
 * Result 型（成功/失敗の値オブジェクト）
 * ============================ */
export type Ok<T> = { ok: true; value: T };
export type Err<E = unknown> = { ok: false; error: E };
export type Result<T, E = unknown> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

export const isOk = <T, E>(r: Result<T, E>): r is Ok<T> => r.ok;
export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => !r.ok;

export const unwrapOrThrow = <T, E = unknown>(r: Result<T, E>): T => {
    if (r.ok) return r.value;
    throw r.error;
};

/* ============================
 * Envelope 定義/判定/unwrap
 * ============================ */
export type ApiEnvelope<T> = {
    success: boolean;
    message: string;
    data: T;
    meta?: unknown;
};

const isAxiosResponse = (v: unknown): v is AxiosResponse =>
    !!v && typeof v === 'object' && 'status' in (v as any) && 'headers' in (v as any);

export const isApiEnvelope = <T = unknown>(payload: unknown): payload is ApiEnvelope<T> => {
    if (!payload || typeof payload !== 'object') return false;
    if (isAxiosResponse(payload)) return false; // AxiosResponse は除外
    const o = payload as Partial<ApiEnvelope<unknown>>;
    const hasKeys =
        'data' in (o as any) &&
        'success' in (o as any) &&
        'message' in (o as any);
    const typeSafe =
        typeof (o as any).success === 'boolean' &&
        typeof (o as any).message === 'string';
    return !!hasKeys && !!typeSafe;
};

/**
 * Envelope を剥がして T を返す
 * - AxiosResponse の場合は res.data を対象にする
 * - Envelope でなければそのまま T として返す（寛容）
 */
export const unwrapApiEnvelope = <T>(payload: T | AxiosResponse | ApiEnvelope<T>): T => {
    const base = isAxiosResponse(payload) ? (payload as AxiosResponse).data : payload;
    return isApiEnvelope<T>(base) ? (base as ApiEnvelope<T>).data : (base as T);
};

/* ============================
 * call / callResult（遅延実行で包む）
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
    return unwrapApiEnvelope<T>(res as any);
};

/**
 * callResult:
 * - 関数を受けて実行
 * - Envelope を unwrap して Result<T, unknown> を返す（値版）
 *   -> UI側で分岐したい/例外を使いたくない場面向け
 */
export const callResult = async <T>(fn: AsyncFn<T>): Promise<Result<T, unknown>> => {
    try {
        const res = await fn();
        return ok(unwrapApiEnvelope<T>(res as any));
    } catch (e) {
        return err(e);
    }
};