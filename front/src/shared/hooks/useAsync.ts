/**
 * useAsyncHook
 * 非同期操作を管理するカスタムHook
 */

import { useState, useEffect, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  isLoading: boolean;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    status: 'idle',
    isLoading: false,
  });

  const execute = useCallback(async () => {
    setState({
      data: null,
      error: null,
      status: 'pending',
      isLoading: true,
    });

    try {
      const response = await asyncFunction();
      setState({
        data: response,
        error: null,
        status: 'success',
        isLoading: false,
      });
      return response;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState({
        data: null,
        error: errorObj,
        status: 'error',
        isLoading: false,
      });
      throw errorObj;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
  };
}
