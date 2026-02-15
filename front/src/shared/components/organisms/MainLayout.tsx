/**
 * メインレイアウトコンポーネント
 * サイドバー + ヘッダー + コンテンツエリア
 */

import React, { memo, useState } from 'react';
import type { BaseProps, NavItem } from '../../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps extends BaseProps {
  navItems: NavItem[];
  headerTitle?: string;
  headerSubtitle?: string;
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
  logo?: React.ReactNode;
  onNavItemClick?: (item: NavItem) => void;
  maxWidth?: 'container' | 'full';
}

/**
 * MainLayout コンポーネント
 * アプリケーション全体のレイアウト
 */
const MainLayout = memo(React.forwardRef<HTMLDivElement, MainLayoutProps>(
  (
    {
      navItems,
      headerTitle = 'ダッシュボード',
      headerSubtitle,
      userName,
      userAvatar,
      onLogout,
      logo,
      onNavItemClick,
      maxWidth = 'container',
      className = '',
      children,
      testId,
      ...props
    },
    ref
  ) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const maxWidthClass = maxWidth === 'container' ? 'max-w-7xl' : 'w-full';

    return (
      <div
        ref={ref}
        className="min-h-screen bg-gray-50 flex flex-col"
        data-testid={testId}
        {...props}
      >
        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar
            items={navItems}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            logo={logo}
            onLogout={onLogout}
            onNavClick={onNavItemClick}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header
              title={headerTitle}
              subtitle={headerSubtitle}
              userName={userName}
              avatar={userAvatar}
              onLogout={onLogout}
              showLogout={false}
            />

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto">
              <div className={`${maxWidthClass} mx-auto px-6 py-8 ${className}`}>
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
));

MainLayout.displayName = 'MainLayout';

export { MainLayout };
export type { MainLayoutProps };

