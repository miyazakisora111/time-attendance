/**
 * FormFieldコンポーネント (Molecule)
 * ラベル + 入力フィールド + エラーメッセージの組み合わせ
 */

import React, { memo } from 'react';
import type { FormFieldProps } from '../../types';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';

interface FormFieldComponentProps extends FormFieldProps {
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  htmlFor?: string;
  children?: React.ReactNode;
}

/**
 * FormField コンポーネント
 * ラベル付きの入力フィールド
 */
const FormField = memo(React.forwardRef<HTMLDivElement, FormFieldComponentProps>(
  (
    {
      label,
      required = false,
      error = false,
      errorMessage,
      helperText,
      disabled = false,
      type = 'text',
      placeholder,
      value,
      onChange,
      onBlur,
      maxLength,
      minLength,
      pattern,
      htmlFor,
      className = '',
      testId,
      children,
      ...props
    },
    ref
  ) => {
    const fieldId = htmlFor || `field-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div
        ref={ref}
        className={`flex flex-col gap-2 ${className}`}
        data-testid={testId}
        {...props}
      >
        {label && (
          <Label
            htmlFor={fieldId}
            required={required}
            disabled={disabled}
          >
            {label}
          </Label>
        )}

        {children ? (
          children
        ) : (
          <Input
            id={fieldId}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            error={error}
            errorMessage={errorMessage}
            required={required}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
          />
        )}

        {helperText && !error && (
          <p className="text-xs text-gray-600">{helperText}</p>
        )}
      </div>
    );
  }
));

FormField.displayName = 'FormField';

export { FormField };
export type { FormFieldComponentProps as FormFieldProps };
