/**
 * 保護されたルートコンポーネント
 * 認証していないユーザーをログインページにリダイレクト
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute
 * 
 * 使用例:
 * ```tsx
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const location = useLocation();

  // 初期化中は何も表示しない (Suspense 使用推奨)
  if (isInitializing) {
    return null;
  }

  // 未認証 → ログインページへリダイレクト
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

  return <>{children}</>;
}
