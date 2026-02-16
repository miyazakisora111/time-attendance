/**
 * Axios インターセプター設定
 * 認証エラーハンドリング
 * 
 * 注意: このモジュールは app-init.ts で呼び出されます
 * 循環依存を避けるため、あえてファイルを分離しています
 */

import type { AxiosInstance } from 'axios';
import { AuthError } from '../errors';

/**
 * グローバル認証エラーハンドラーを登録
 * @param instance Axios インスタンス
 * @param onAuthError 認証エラー時のコールバック (logout を実行)
 */
export function setupAuthInterceptor(
  instance: AxiosInstance,
  onAuthError: () => void
): void {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // 401 エラー → ログアウト処理を実行
      if (
        error instanceof AuthError ||
        error.response?.status === 401
      ) {
        onAuthError();
        // ローカルストレージをクリア (状態が必要に応じて)
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}
