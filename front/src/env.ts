interface EnvConfig {
  API_URL: string;
  API_BASE_URL: string;
  API_TIMEOUT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  DEBUG: boolean;
}

/**
 * 環境変数を読み込み、型安全な設定値へ変換する。
 */
function getEnvConfig(): EnvConfig {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiUrl = apiBaseUrl || import.meta.env.VITE_API_URL;
  const apiTimeout = import.meta.env.VITE_API_TIMEOUT;
  const nodeEnv = import.meta.env.VITE_NODE_ENV as EnvConfig['NODE_ENV'] | undefined;
  const debugFlag = import.meta.env.VITE_DEBUG;

  if (!apiUrl) throw new Error('VITE_API_URL が設定されていません');
  const timeout = apiTimeout ? parseInt(apiTimeout, 10) : 30000;
  if (isNaN(timeout) || timeout <= 0) throw new Error('VITE_API_TIMEOUT は正の整数である必要があります');

  return {
    API_URL: apiUrl,
    API_BASE_URL: apiUrl,
    API_TIMEOUT: timeout,
    NODE_ENV: nodeEnv ?? 'development',
    DEBUG: debugFlag === 'true',
  };
}

export const env = getEnvConfig();
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
