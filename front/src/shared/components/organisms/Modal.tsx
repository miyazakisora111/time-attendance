/**
 * モーダルコンポーネント (Organism)
 */

import React, { memo } from 'react';
import type { ModalProps } from '../../types';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';

interface ModalComponentProps extends ModalProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  footer?: React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

/**
 * Modal コンポーネント
 */
const Modal = memo(React.forwardRef<HTMLDivElement, ModalComponentProps>(
  (
    {
      open = false,
      onClose,
      title,
      size = 'md',
      closeOnBackdropClick = true,
      closeOnEscapeKey = true,
      footer,
      actions,
      className = '',
      children,
      testId,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      if (!closeOnEscapeKey) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && open) {
          onClose();
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [open, closeOnEscapeKey, onClose]);

    if (!open) return null;

    const sizeClass = sizeClasses[size] || sizeClasses.md;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        data-testid={testId}
        {...props}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={() => closeOnBackdropClick && onClose()}
          role="presentation"
        />

        {/* Modal Content */}
        <div
          ref={ref}
          className={`
            relative bg-white rounded-lg shadow-2xl
            max-h-[90vh] overflow-y-auto
            ${sizeClass} w-full flex flex-col
            ${className}
          `.trim()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Text id="modal-title" variant="h4" weight="bold">
                {title}
              </Text>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 p-6">
            {children}
          </div>

          {/* Footer */}
          {(footer || actions) && (
            <div className="border-t border-gray-200 p-6 flex items-center justify-end gap-3">
              {footer}
              {!footer && actions && (
                <>
                  <Button
                    variant="secondary"
                    onClick={onClose}
                  >
                    キャンセル
                  </Button>
                  {actions.map((action) => (
                    <Button
                      key={action.label}
                      variant={action.variant || 'primary'}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
));

Modal.displayName = 'Modal';

export { Modal };
export type { ModalComponentProps as ModalProps };
