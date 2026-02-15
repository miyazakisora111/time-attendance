/**
 * アプリケーション定数
 */

// ブレークポイント
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// APIエンドポイント
export const API_ENDPOINTS = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
  },
  users: {
    list: '/users',
    get: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  attendance: {
    list: '/attendance',
    get: (id: string) => `/attendance/${id}`,
    clockIn: '/attendance/clock-in',
    clockOut: '/attendance/clock-out',
    records: (userId: string) => `/attendance/users/${userId}`,
  },
} as const;

// ローカルストレージキー
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  refreshToken: 'refresh_token',
  user: 'user',
  theme: 'theme',
  language: 'language',
  sidebarCollapsed: 'sidebar_collapsed',
} as const;

// ユーザーロール
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const;

// 勤務状態
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  REMOTE: 'remote',
} as const;

// HTTPステータスコード
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// タイムアウト設定（ミリ秒）
export const TIMEOUTS = {
  apiRequest: 30000,
  debounce: 500,
  animationDuration: 300,
  notificationDuration: 5000,
} as const;

// ページネーション設定
export const PAGINATION = {
  defaultPageSize: 20,
  defaultPage: 1,
  maxPageSize: 100,
} as const;

// フォーム検証ルール
export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    requireUpperCase: true,
    requireLowerCase: true,
    requireNumber: true,
    requireSpecialChar: true,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

// 日時フォーマット
export const DATE_FORMATS = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm:ss',
  datetime: 'YYYY-MM-DD HH:mm:ss',
  month: 'YYYY-MM',
  year: 'YYYY',
} as const;

// キャッシュ設定（ミリ秒）
export const CACHE_DURATION = {
  short: 5 * 60 * 1000,         // 5分
  medium: 30 * 60 * 1000,       // 30分
  long: 24 * 60 * 60 * 1000,    // 24時間
} as const;
