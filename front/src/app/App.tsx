/**
 * Root App コンポーネント
 * 
 * 責務:
 * - ルーター + Providers の統合
 * - グローバル認証初期化
 */

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { bootstrap } from './app-init';
import { router } from './router';
import { Providers } from './providers';
import { useAuthInitialize } from '@/features/auth';
import './styles.css';

/**
 * 初期化ラッパーコンポーネント
 * 認証状態を確認してからレンダリング
 */
function AppInitializer() {
  const { isInitialized } = useAuthInitialize();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">初期化中...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

/**
 * Root App コンポーネント
 */
function App() {
  useEffect(() => {
    // アプリケーション初期化
    bootstrap();
  }, []);

  return (
    <Providers>
      <AppInitializer />
    </Providers>
  );
}

export default App;
