/**
 * UI ユーティリティ関数
 * Tailwind CSS のクラスマージング
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS クラスをマージする
 * clsx + tailwind-merge で重複や競合するクラスを自動的に解決
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
