/**
 * Badgeコンポーネント
 * ステータスやタグ表示用
 */

import React, { memo } from 'react';
import type { BaseProps } from '../../types';

interface BadgeProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  filled?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<string, { filled: string; outline: string }> = {
  primary: {
    filled: 'bg-blue-600 text-white',
    outline: 'border border-blue-600 text-blue-600 bg-transparent',
  },
  secondary: {
    filled: 'bg-gray-200 text-gray-900',
    outline: 'border border-gray-300 text-gray-700 bg-transparent',
  },
  success: {
    filled: 'bg-green-600 text-white',
    outline: 'border border-green-600 text-green-600 bg-transparent',
  },
  danger: {
    filled: 'bg-red-600 text-white',
    outline: 'border border-red-600 text-red-600 bg-transparent',
  },
  warning: {
    filled: 'bg-yellow-500 text-white',
    outline: 'border border-yellow-500 text-yellow-600 bg-transparent',
  },
  info: {
    filled: 'bg-blue-500 text-white',
    outline: 'border border-blue-500 text-blue-600 bg-transparent',
  },
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

/**
 * Badge コンポーネント
 */
const Badge = memo(React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      filled = true,
      icon,
      className = '',
      children,
      testId,
      ...props
    },
    ref
  ) => {
    const variantClass = variantClasses[variant];
    const styleClass = filled ? variantClass.filled : variantClass.outline;
    const sizeClass = sizeClasses[size] || sizeClasses.md;

    const baseClass = `
      inline-flex items-center gap-1.5
      rounded-full font-medium
      whitespace-nowrap
      ${styleClass}
      ${sizeClass}
      ${className}
    `.trim();

    return (
      <div
        ref={ref}
        className={baseClass}
        data-testid={testId}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>
    );
  }
));

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };
