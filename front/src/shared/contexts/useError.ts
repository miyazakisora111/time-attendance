import { useContext } from 'react';
import { ErrorContext, type ErrorContextValue } from '@/shared/contexts/error-context';

export function useError(): ErrorContextValue {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }

  return context;
}
