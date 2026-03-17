import { z } from 'zod';

/**
 * ログインフォームの入力スキーマ。
 */
export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});
