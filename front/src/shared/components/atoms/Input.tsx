/**
 * テキスト入力Atomコンポーネント
 */

import React, { memo } from 'react';
import type { InputProps } from '../../types';

interface InputComponentProps extends InputProps {
  id?: string;
}

/**
 * Input コンポーネント
 * すべてのテキスト入力フィールドの基本
 */
const Input = memo(React.forwardRef<HTMLInputElement, InputComponentProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      onBlur,
      disabled = false,
      error = false,
      errorMessage,
      required = false,
      maxLength,
      minLength,
      pattern,
      className = '',
      testId,
      ariaLabel,
      ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const baseClass = `
      w-full px-3 py-2 border rounded-lg
      text-base font-normal
      transition-colors duration-200
      bg-white
      ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
      ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-50' : 'focus:border-blue-500'}
      focus:outline-none focus:ring-2
      ${className}
    `.trim();

    return (
      <div className="flex flex-col">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={baseClass}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error}
          aria-required={required}
          data-testid={testId}
          {...props}
        />
        {error && errorMessage && (
          <span className="mt-1 text-sm text-red-600" role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
));

Input.displayName = 'Input';

export { Input };
export type { InputComponentProps as InputProps };
