import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { setApiErrorHandler } from '@/api/client';
import {
  ErrorContext,
  initialState,
  type ShowErrorParams,
  type ErrorState,
} from '@/shared/contexts/error-context';

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ErrorState>(initialState);

  const resetError = useCallback(() => {
    setState(initialState);
  }, []);

  const closeError = useCallback(() => {
    resetError();
  }, [resetError]);

  const showError = useCallback(({ title = 'エラーが発生しました', messages }: ShowErrorParams) => {
    setState({
      isOpen: true,
      title,
      messages,
    });
  }, []);

  useEffect(() => {
    setApiErrorHandler(({ title, messages }) => {
      showError({ title, messages });
    });

    return () => {
      setApiErrorHandler(null);
    };
  }, [showError]);

  const value = useMemo(
    () => ({
      ...state,
      showError,
      closeError,
      resetError,
    }),
    [state, showError, closeError, resetError]
  );

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
}
