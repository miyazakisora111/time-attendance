/**
 * ButtonGroupコンポーネント (Molecule)
 * 複数のボタンをグループ化
 */

import React, { memo } from 'react';
import type { BaseProps } from '../../types';

interface ButtonGroupProps extends BaseProps {
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'connected' | 'spaced';
  disabled?: boolean;
}

/**
 * ButtonGroup コンポーネント
 */
const ButtonGroup = memo(React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      orientation = 'horizontal',
      size = 'md',
      variant = 'spaced',
      disabled = false,
      className = '',
      children,
      testId,
      ...props
    },
    ref
  ) => {
    const orientationClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col';
    const spacingClass = variant === 'spaced' ? 'gap-2' : 'gap-0';

    const baseClass = `
      inline-flex ${orientationClass} ${spacingClass}
      ${disabled ? 'opacity-50' : ''}
      ${className}
    `.trim();

    return (
      <div
        ref={ref}
        className={baseClass}
        role="group"
        data-testid={testId}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          return React.cloneElement(child as React.ReactElement<any>, {
            disabled: disabled || child.props.disabled,
            size: size,
          });
        })}
      </div>
    );
  }
));

ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
export type { ButtonGroupProps };
