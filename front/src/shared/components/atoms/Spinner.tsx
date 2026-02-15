/**
 * ローディングスピナーコンポーネント
 */

import React, { memo } from 'react';
import type { BaseProps } from '../../types';

interface SpinnerProps extends BaseProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
  label?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const colorClasses: Record<string, string> = {
  primary: 'border-blue-600 border-t-transparent',
  secondary: 'border-gray-400 border-t-transparent',
  white: 'border-white border-t-transparent',
};

/**
 * Spinner コンポーネント
 */
const Spinner = memo(React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      color = 'primary',
      fullScreen = false,
      label,
      className = '',
      testId,
      ...props
    },
    ref
  ) => {
    const sizeClass = sizeClasses[size] || sizeClasses.md;
    const colorClass = colorClasses[color] || colorClasses.primary;

    const spinnerClass = `
      inline-block ${sizeClass}
      border-4 border-current rounded-full animate-spin
      ${colorClass}
      ${className}
    `.trim();

    if (fullScreen) {
      return (
        <div
          ref={ref}
          className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm"
          data-testid={testId}
          {...props}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={spinnerClass} />
            {label && <p className="text-gray-700 font-medium">{label}</p>}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="inline-flex flex-col items-center gap-2"
        data-testid={testId}
        {...props}
      >
        <div className={spinnerClass} />
        {label && <p className="text-sm text-gray-600">{label}</p>}
      </div>
    );
  }
));

Spinner.displayName = 'Spinner';

export { Spinner };
export type { SpinnerProps };
