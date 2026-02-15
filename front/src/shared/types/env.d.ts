/**
 * TypeScript グローバル型定義
 */

declare module '*.module.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface ImportMeta {
  readonly env: {
    readonly VITE_API_URL: string;
    readonly VITE_API_TIMEOUT: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_ENVIRONMENT: string;
    readonly VITE_ENABLE_DEBUG: string;
    readonly VITE_ENABLE_ANALYTICS: string;
  };
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_API_URL?: string;
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}
