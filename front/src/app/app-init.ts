/**
 * アプリケーション初期化
 * ブートストラップロジック
 * 
 * 実行順序:
 * 1. Query Client 生成
 * 2. Zustand Store 初期化
 * 3. 認証ユーザー確認 (GET /auth/me)
 * 4. インターセプター設定
 * 5. ルーター初期化
 */

import { QueryClient } from '@tanstack/react-query';
import { createQueryClient } from '@/lib';

let queryClient: QueryClient | null = null;

/**
 * Query Client の遅延初期化
 * SSR 対応の為に singleton で管理
 */
export function initQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}

/**
 * 認証状態の初期化 (ページリロード時)
 * 
 * Sanctum の場合、GET /auth/me で
 * 既存のセッションを確認
 * 
 * 詳細は features/auth/hooks.ts の useAuthMe で実装
 */
export async function initializeAuth(): Promise<void> {
  // 実装は features/auth/hooks.ts の useAuthInitialize() で実行
  // Zustand store が自動的に同期
}

/**
 * 全体初期化を実行
 * main.tsx から呼び出される
 */
export function bootstrap(): void {
  // Query Client 初期化
  initQueryClient();

  // 詳細な初期化は App.tsx で実行
  // (useEffect で認証確認)
}
