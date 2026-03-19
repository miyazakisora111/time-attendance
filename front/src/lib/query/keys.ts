import type { QueryKey } from '@tanstack/react-query';

/**
 * QueryKey を型レベルで満たすことを保証するヘルパー。
 */
export const key = <T extends readonly unknown[]>(...k: T) => k satisfies QueryKey;

/**
 * スコープを固定した KeyFactory
 */
export const makeScopedKeys = <S extends string>(scope: S) => {
    return {
        scope: scope as S,
        all: () => key(scope),
        nest: <T extends readonly unknown[]>(...parts: T) =>
            key(scope, ...parts),
    };
};