/**
 * UI ストア (Zustand)
 * グローバルUI状態を管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  showNotification: boolean;
  notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null;

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  hideNotification: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      showNotification: false,
      notification: null,

      setTheme: (theme) => {
        set({ theme });
        // DOM にテーマを適用
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      showToast: (type, message) => {
        set({
          notification: { type, message },
          showNotification: true,
        });
        // 5秒後に自動的に非表示
        const timer = setTimeout(() => {
          set({ showNotification: false });
        }, 5000);

        return () => clearTimeout(timer);
      },

      hideNotification: () => {
        set({ showNotification: false, notification: null });
      },
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
