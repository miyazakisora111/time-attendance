interface EnvConfig {
  /** API URL */
  API_URL: string;
  /** API タイムアウト(ms) */
  API_TIMEOUT: number;
  /** 実行環境 */
  NODE_ENV: 'development' | 'production' | 'test';
  /** デバッグフラグ */
  DEBUG: boolean;
}

/** APIタイムアウト既定値(ms)。 */
const DEFAULT_API_TIMEOUT_MS = 30_000;

/**
 * 環境変数を読み込み、型安全な設定値へ変換する。
 */
function getEnvConfig(): EnvConfig {
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiTimeout = import.meta.env.VITE_API_TIMEOUT;
  const nodeEnv = import.meta.env.VITE_NODE_ENV as EnvConfig['NODE_ENV'] | undefined;
  const debugFlag = import.meta.env.VITE_DEBUG;

  if (!apiUrl) throw new Error('VITE_API_URL が設定されていません');
  const timeout = apiTimeout ? parseInt(apiTimeout, 10) : DEFAULT_API_TIMEOUT_MS;
  if (isNaN(timeout) || timeout <= 0) throw new Error('VITE_API_TIMEOUT は正の整数である必要があります');

  return {
    API_URL: apiUrl,
    API_TIMEOUT: timeout,
    NODE_ENV: nodeEnv ?? 'development',
    DEBUG: debugFlag === 'true',
  };
}

/** 変換済み環境設定。 */
export const env = getEnvConfig();
/** 本番環境判定。 */
export const isProduction = env.NODE_ENV === 'production';
/** 開発環境判定。 */
export const isDevelopment = env.NODE_ENV === 'development';
/** テスト環境判定。 */
export const isTest = env.NODE_ENV === 'test';
