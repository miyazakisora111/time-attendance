/**
 * 共通型定義ファイル
 * アプリケーション全体で使用される基本的な型をまとめています
 */

// コンポーネントの基本Props型
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  testId?: string;
}

// ボタン関連の型
export interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

// フォーム入力関連の型
export interface InputProps extends BaseProps {
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

// カード関連の型
export interface CardProps extends BaseProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
}

// フォームフィールド型
export interface FormFieldProps extends BaseProps {
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  htmlFor?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

// モーダル関連の型
export interface ModalProps extends BaseProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
}

// ナビゲーションアイテム型
export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  active?: boolean;
  badge?: string;
  children?: NavItem[];
}

// ユーザー関連の型
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
}

// 出退勤記録の型
export interface AttendanceRecord {
  id: string;
  userId: string;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  status: 'present' | 'absent' | 'late' | 'half_day';
  note?: string;
}

// API レスポンス型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

// ページネーション型
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// レスポンシブブレークポイント
export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// スタイル・レイアウト関連の型
export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export interface Colors {
  primary: string;
  secondary: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

