import { useContext } from 'react';
import { ErrorContext, type ErrorContextValue } from '@/shared/contexts/error-context';

/**
 * ErrorContext を取得する hook。
 *
 * @returns ErrorContextValue
 */
export function useError(): ErrorContextValue {
  const context = useContext(ErrorContext);

  // Provider 外で使用された場合は実装ミスとして例外を投げる。
  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }

  return context;
}
