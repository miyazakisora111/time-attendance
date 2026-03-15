import { createContext } from 'react';

/**
 * エラーモーダルの表示状態。
 */
export type ErrorState = {
  /** モーダル表示状態 */
  isOpen: boolean;
  /** タイトル */
  title: string;
  /** メッセージ一覧 */
  messages: string[];
};

/**
 * エラー表示要求の入力。
 */
export type ShowErrorParams = {
  /** タイトル（未指定時は既定値） */
  title?: string;
  /** 表示メッセージ一覧 */
  messages: string[];
};

/**
 * ErrorContext で公開する値。
 */
export type ErrorContextValue = ErrorState & {
  /** エラーを表示する */
  showError: (params: ShowErrorParams) => void;
  /** エラー表示を閉じる */
  closeError: () => void;
  /** 状態を初期化する */
  resetError: () => void;
};

/**
 * エラー状態の初期値。
 */
export const initialState: ErrorState = {
  isOpen: false,
  title: '',
  messages: [],
};

/**
 * エラー表示共有コンテキスト。
 */
export const ErrorContext = createContext<ErrorContextValue | null>(null);
