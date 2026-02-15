/**
 * テキストAtomコンポーネント
 * 見出しや本文テキストの基本
 */

import React, { memo } from 'react';
import type { BaseProps } from '../../types';

interface TextProps extends BaseProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'inherit' | string;
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  lineClamp?: number;
  as?: 'p' | 'span' | 'div';
}

const variantClasses: Record<string, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-semibold',
  h6: 'text-base font-semibold',
  body: 'text-base font-normal',
  caption: 'text-sm font-normal',
  overline: 'text-xs font-semibold uppercase tracking-wider',
};

const weightClasses: Record<string, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorClasses: Record<string, string> = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  danger: 'text-red-600',
  success: 'text-green-600',
  inherit: 'text-inherit',
};

const alignClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

/**
 * Text コンポーネント
 * わかりやすいテキスト描画
 */
const Text = memo(React.forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = 'body',
      weight = 'normal',
      color = 'inherit',
      align = 'left',
      truncate = false,
      lineClamp,
      as = 'p',
      className = '',
      children,
      testId,
      ...props
    },
    ref
  ) => {
    const Component = as as React.ElementType;
    const variantClass = variantClasses[variant] || variantClasses.body;
    const weightClass = weightClasses[weight] || weightClasses.normal;
    const colorClass = colorClasses[color] || color;
    const alignClass = alignClasses[align] || alignClasses.left;

    let finalClass = `${variantClass} ${weightClass} ${colorClass} ${alignClass}`;

    if (truncate) {
      finalClass += ' truncate';
    }

    if (lineClamp) {
      finalClass += ` line-clamp-${lineClamp}`;
    }

    finalClass += ` ${className}`;

    return (
      <Component
        ref={ref}
        className={finalClass.trim()}
        data-testid={testId}
        {...props}
      >
        {children}
      </Component>
    );
  }
));

Text.displayName = 'Text';

export { Text };
export type { TextProps };
