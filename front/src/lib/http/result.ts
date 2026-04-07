import type { AxiosResponse } from 'axios';
import { isRecord } from '@/shared/utils/guards';

/**
 * API の共通レスポンスエンベロープ。
 */
type ApiEnvelope<T> = {
    success: boolean;
    message: string;
    data: T;
    meta?: unknown;
};

/**
 * API 呼び出し結果として受け取り得る型。
 */
type ApiPayload<T> = T | ApiEnvelope<T> | AxiosResponse<unknown>;

/**
 * 非同期 API 関数の型。
 */
type AsyncFn<T> = () => Promise<T>;

/**
 * オブジェクトが特定のキーを自身のプロパティとして持つか判定する。
 */
const hasOwnKey = <TKey extends string>(
    value: Record<string, unknown>,
    key: TKey,
): value is Record<TKey, unknown> & Record<string, unknown> => {
    return Object.prototype.hasOwnProperty.call(value, key);
};

/**
 * AxiosResponse かどうかを判定する型ガード。
 */
const isAxiosResponse = (value: unknown): value is AxiosResponse<unknown> => {
    if (!isRecord(value)) return false;

    return (
        hasOwnKey(value, 'status') &&
        hasOwnKey(value, 'headers') &&
        hasOwnKey(value, 'data')
    );
};

/**
 * API エンベロープ形式かどうかを判定する。
 */
export const isApiEnvelope = <T = unknown>(
    payload: unknown
): payload is ApiEnvelope<T> => {
    if (!isRecord(payload)) return false;
    if (isAxiosResponse(payload)) return false;

    const hasKeys =
        hasOwnKey(payload, 'data') &&
        hasOwnKey(payload, 'success') &&
        hasOwnKey(payload, 'message');

    const typeSafe =
        typeof payload.success === 'boolean' &&
        typeof payload.message === 'string';

    return hasKeys && typeSafe;
};

/**
 * AxiosResponse / ApiEnvelope を透過的に剥がして実データを返す。
 */
export const unwrapApiEnvelope = <T>(payload: ApiPayload<T>): T => {
    const base: unknown = isAxiosResponse(payload) ? payload.data : payload;
    return isApiEnvelope<T>(base) ? base.data : (base as T);
};

/**
 * API 関数を実行し、レスポンス形式を意識せずにデータを取得する。
 */
export const call = async <T>(fn: AsyncFn<T>): Promise<T> => {
    const res = await fn();
    return unwrapApiEnvelope<T>(res as ApiPayload<T>);
};