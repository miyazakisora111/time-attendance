/**
 * ヘッダーコンポーネント (Organism)
 * アプリケーションのトップナビゲーション
 */

import React, { memo } from 'react';
import type { BaseProps } from '../../types';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

interface HeaderProps extends BaseProps {
  title?: string;
  subtitle?: string;
  onLogout?: () => void;
  showLogout?: boolean;
  avatar?: string;
  userName?: string;
}

/**
 * Header コンポーネント
 */
const Header = memo(React.forwardRef<HTMLHeaderElement, HeaderProps>(
  (
    {
      title,
      subtitle,
      onLogout,
      showLogout = true,
      avatar,
      userName,
      className = '',
      testId,
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = `
      bg-white border-b border-gray-200 shadow-sm
      sticky top-0 z-40
      ${className}
    `.trim();

    return (
      <header
        ref={ref}
        className={baseClass}
        data-testid={testId}
        {...props}
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex-1">
            {title && (
              <Text variant="h3" weight="bold" className="mb-1">
                {title}
              </Text>
            )}
            {subtitle && (
              <Text variant="body" color="secondary" className="text-gray-600">
                {subtitle}
              </Text>
            )}
          </div>

          {children || (
            <div className="flex items-center gap-4">
              {userName && (
                <div className="flex items-center gap-3">
                  {avatar && (
                    <img
                      src={avatar}
                      alt={userName}
                      className="w-8 h-8 rounded-full bg-gray-200"
                      loading="lazy"
                    />
                  )}
                  <Text variant="body" className="text-gray-700">
                    {userName}
                  </Text>
                </div>
              )}

              {showLogout && onLogout && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                >
                  ログアウト
                </Button>
              )}
            </div>
          )}
        </div>
      </header>
    );
  }
));

Header.displayName = 'Header';

export { Header };
export type { HeaderProps };
