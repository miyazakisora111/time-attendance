/**
 * サイドバーコンポーネント (Organism)
 */

import React, { memo, useState } from 'react';
import type { BaseProps, NavItem } from '../../types';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

interface SidebarProps extends BaseProps {
  items: NavItem[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  logo?: React.ReactNode;
  onLogout?: () => void;
  onNavClick?: (item: NavItem) => void;
}

export type { NavItem };

/**
 * Sidebar コンポーネント
 */
const Sidebar = memo(React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      items,
      collapsed = false,
      onCollapsedChange,
      logo,
      onLogout,
      onNavClick,
      className = '',
      testId,
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpanded = (id: string) => {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      setExpandedItems(newExpanded);
    };

    const handleNavItem = (item: NavItem) => {
      if (item.children) {
        toggleExpanded(item.id);
      }
      onNavClick?.(item);
    };

    const baseClass = `
      h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300
      bg-gray-900 text-white overflow-y-auto
      flex flex-col border-r border-gray-800
      ${className}
    `.trim();

    return (
      <div
        ref={ref}
        className={baseClass}
        data-testid={testId}
        {...props}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              {logo && <div className="flex-shrink-0">{logo}</div>}
              <Text variant="h6" weight="bold" color="inherit">
                時間管理
              </Text>
            </div>
          )}
          <button
            onClick={() => onCollapsedChange?.(!collapsed)}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
            aria-label={collapsed ? '展開' : '折りたたむ'}
          >
            ☰
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {items.map((item) => (
            <NavItemComponent
              key={item.id}
              item={item}
              collapsed={collapsed}
              isExpanded={expandedItems.has(item.id)}
              onClick={() => handleNavItem(item)}
            />
          ))}
        </nav>

        {/* Logout Button */}
        {onLogout && !collapsed && (
          <div className="p-4 border-t border-gray-800">
            <Button
              variant="danger"
              fullWidth
              onClick={onLogout}
            >
              ログアウト
            </Button>
          </div>
        )}
      </div>
    );
  }
));

/**
 * NavItem内部コンポーネント
 */
interface NavItemComponentProps {
  item: NavItem;
  collapsed: boolean;
  isExpanded: boolean;
  onClick: () => void;
  level?: number;
}

const NavItemComponent = memo(
  ({ item, collapsed, isExpanded, onClick, level = 0 }: NavItemComponentProps) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.active || false;

    return (
      <div key={item.id}>
        <button
          onClick={onClick}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg
            transition-colors duration-200 text-left
            ${isActive ? 'bg-blue-600 text-white' : 'text-gray-100 hover:bg-gray-800'}
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? item.label : undefined}
        >
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          {!collapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              )}
            </>
          )}
        </button>

        {/* ネストされたアイテム */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="ml-4 mt-2 space-y-2 border-l border-gray-700 pl-2">
            {item.children!.map((child) => (
              <NavItemComponent
                key={child.id}
                item={child}
                collapsed={collapsed}
                isExpanded={false}
                onClick={() => {}}
                level={(level || 0) + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';
NavItemComponent.displayName = 'NavItemComponent';

export { Sidebar };
export type { SidebarProps, NavItem };
