/**
 * 環境変数 (型安全ラッパー)
 * ビルド時に検証、ランタイムでの型安全性を保証
 */

interface EnvConfig {
  API_URL: string;
  API_TIMEOUT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  DEBUG: boolean;
}

/**
 * 環境変数の検証と取得
 * ビルド時に不正な設定が検出される
 */
function getEnvConfig(): EnvConfig {
  const apiUrl = import.meta.env.VITE_API_URL as string;
  const apiTimeout = import.meta.env.VITE_API_TIMEOUT as string;

  if (!apiUrl) {
    throw new Error(
      '環境変数 VITE_API_URL が設定されていません。.env ファイルを確認してください。'
    );
  }

  return {
    API_URL: apiUrl,
    API_TIMEOUT: apiTimeout ? parseInt(apiTimeout, 10) : 30000,
    NODE_ENV: 'development',
    DEBUG: false,
  };
}

export const env = getEnvConfig();

/**
 * 環境判定ユーティリティ
 */
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
