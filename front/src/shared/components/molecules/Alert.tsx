/**
 * Alertコンポーネント (Molecule)
 * メッセージを表示する
 */

import React, { memo } from 'react';
import type { BaseProps } from '../../types';
import { Text } from '../atoms/Text';

interface AlertProps extends BaseProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
  onDismiss?: () => void;
  closable?: boolean;
}

const typeClasses: Record<string, string> = {
  success: 'bg-green-50 border border-green-200 text-green-800',
  error: 'bg-red-50 border border-red-200 text-red-800',
  warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border border-blue-200 text-blue-800',
};

/**
 * Alert コンポーネント
 */
const Alert = memo(React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = 'info',
      title,
      description,
      onDismiss,
      closable = false,
      className = '',
      testId,
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(true);

    const handleDismiss = () => {
      setVisible(false);
      onDismiss?.();
    };

    if (!visible) return null;

    const typeClass = typeClasses[type] || typeClasses.info;

    const baseClass = `
      rounded-lg p-4 ${typeClass} ${className}
    `.trim();

    return (
      <div
        ref={ref}
        className={baseClass}
        role="alert"
        data-testid={testId}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            {title && (
              <Text variant="h6" color="inherit" className="mb-1">
                {title}
              </Text>
            )}
            {description && (
              <Text variant="body" color="inherit">
                {description}
              </Text>
            )}
            {children && !description && (
              <Text variant="body" color="inherit">
                {children}
              </Text>
            )}
          </div>

          {closable && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-lg leading-none opacity-60 hover:opacity-100 transition-opacity"
              aria-label="閉じる"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }
));

Alert.displayName = 'Alert';

export { Alert };
export type { AlertProps };
