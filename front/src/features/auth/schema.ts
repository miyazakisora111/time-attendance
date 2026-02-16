/**
 * 認証フィーチャー - Zod スキーマ
 * すべてのフォーム入力バリデーション
 */

import { z } from 'zod';

/**
 * メールアドレス (再利用可能)
 */
const emailSchema = z
  .string()
  .min(1, 'メールアドレスを入力してください')
  .email('有効なメールアドレスを入力してください');

/**
 * パスワード (再利用可能)
 * 要件: 8字以上、英大文字・英小文字・数字を含む
 */
const passwordSchema = z
  .string()
  .min(8, 'パスワードは8字以上です')
  .regex(/[A-Z]/, '英大文字を1字以上含む必要があります')
  .regex(/[a-z]/, '英小文字を1字以上含む必要があります')
  .regex(/[0-9]/, '数字を1字以上含む必要があります');

/**
 * ログインフォーム
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'パスワードを入力してください'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

/**
 * 登録フォーム
 */
export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, '名前を入力してください')
      .max(100, '名前は100字以下です'),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;
