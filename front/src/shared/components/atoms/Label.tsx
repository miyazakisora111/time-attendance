/**
 * Labelコンポーネント
 * フォーム用の標籤
 */

import React, { memo } from 'react';
import type { BaseProps } from '../../types';

interface LabelProps extends BaseProps {
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Label コンポーネント
 */
const Label = memo(React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      htmlFor,
      required = false,
      disabled = false,
      size = 'md',
      className = '',
      children,
      testId,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-xs font-medium',
      md: 'text-sm font-medium',
      lg: 'text-base font-semibold',
    };

    const baseClass = `
      block ${sizeClasses[size] || sizeClasses.md}
      text-gray-700 transition-colors duration-200
      ${disabled ? 'text-gray-400 cursor-not-allowed' : ''}
      ${className}
    `.trim();

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={baseClass}
        data-testid={testId}
        {...props}
      >
        {children}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
    );
  }
));

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
