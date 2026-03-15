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

/**
 * エラー表示状態を提供する Provider。
 *
 * @param children 子要素
 */
export function ErrorProvider({ children }: { children: ReactNode }) {
  /** エラーモーダル状態 */
  const [state, setState] = useState<ErrorState>(initialState);

  /**
   * 状態を初期値へ戻す。
   */
  const resetError = useCallback(() => {
    setState(initialState);
  }, []);

  /**
   * エラー表示を閉じる。
   */
  const closeError = useCallback(() => {
    resetError();
  }, [resetError]);

  /**
   * エラー表示を開く。
   *
   * @param title タイトル
   * @param messages メッセージ配列
   */
  const showError = useCallback(({ title = 'エラーが発生しました', messages }: ShowErrorParams) => {
    setState({
      isOpen: true,
      title,
      messages,
    });
  }, []);

  /**
   * API共通エラーハンドラーを登録する。
   */
  useEffect(() => {
    setApiErrorHandler(({ title, messages }) => {
      showError({ title, messages });
    });

    return () => {
      setApiErrorHandler(null);
    };
  }, [showError]);

  /**
   * コンテキスト値をメモ化し不要再描画を抑える。
   */
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
