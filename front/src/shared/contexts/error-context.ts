import { createContext } from 'react';

export type ErrorState = {
  isOpen: boolean;
  title: string;
  messages: string[];
};

export type ShowErrorParams = {
  title?: string;
  messages: string[];
};

export type ErrorContextValue = ErrorState & {
  showError: (params: ShowErrorParams) => void;
  closeError: () => void;
  resetError: () => void;
};

export const initialState: ErrorState = {
  isOpen: false,
  title: '',
  messages: [],
};

export const ErrorContext = createContext<ErrorContextValue | null>(null);
