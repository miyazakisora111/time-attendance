/**
 * ボタンAtomコンポーネント
 * すべてのボタン機能の基本となるコンポーネント
 */

import React, { memo } from 'react';
import type { ButtonProps } from '../../types';

const buttonVariants: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100',
  outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50 active:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400',
  ghost: 'text-gray-900 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400',
};

const sizeVariants: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-lg',
};

interface ButtonComponentProps extends ButtonProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

/**
 * Button コンポーネント
 * @param variant - ボタンのスタイルバリアント
 * @param size - ボタンのサイズ
 * @param disabled - 無効化状態
 * @param fullWidth - 親の幅に合わせるか
 * @param loading - ローディング状態
 * @param className - 追加のクラス名
 * @param children - ボタンテキスト
 * @param ariaLabel - アクセシビリティ用ラベル
 * @param testId - テスト用ID
 */
const Button = memo(React.forwardRef<HTMLButtonElement, ButtonComponentProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      fullWidth = false,
      loading = false,
      type = 'button',
      className = '',
      children,
      testId,
      ariaLabel,
      ariaDescribedBy,
      onClick,
      ...props
    },
    ref
  ) => {
    const variantClass = buttonVariants[variant] || buttonVariants.primary;
    const sizeClass = sizeVariants[size] || sizeVariants.md;
    const widthClass = fullWidth ? 'w-full' : '';

    const baseClass = `
      inline-flex items-center justify-center
      font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      ${variantClass}
      ${sizeClass}
      ${widthClass}
      ${disabled || loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      ${className}
    `.trim();

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={baseClass}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        data-testid={testId}
        {...props}
      >
        {loading && (
          <span
            className="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
));

Button.displayName = 'Button';

export { Button };
export type { ButtonComponentProps as ButtonProps };

